# React Native Migration Guide: Data Storage Architecture

This document translates the Flutter/ObjectBox data storage architecture to React Native, providing solutions using SQLite, MMKV, and WatermelonDB.

## Current Architecture (Flutter/ObjectBox)

The Flow app currently uses:
- **ObjectBox**: Embedded NoSQL database for all persistent data
- **Profile Entity**: Stores user name and profile information
- **Transaction Entity**: Stores all financial transactions
- **Local Preferences**: Device-specific settings (SharedPreferences)

## React Native Alternatives

### Option 1: WatermelonDB (Recommended for Complex Data)
Best for: Complex relational data, real-time sync, large datasets
- Similar to ObjectBox in terms of being an embedded database
- Built on SQLite with reactive queries
- Excellent for transactions, accounts, categories with relationships

### Option 2: SQLite (react-native-sqlite-storage / expo-sqlite)
Best for: Full control, SQL queries, migrations
- Direct SQLite access
- More manual setup but maximum flexibility
- Good for complex queries and migrations

### Option 3: MMKV (react-native-mmkv)
Best for: Simple key-value storage, high performance
- Extremely fast key-value storage
- Good for preferences and simple data
- Not ideal for complex relational data

## Implementation Solutions

### Solution 1: WatermelonDB (Recommended)

WatermelonDB is the closest equivalent to ObjectBox in React Native, providing:
- Embedded database (SQLite-based)
- Reactive queries
- Relationship handling
- Type-safe models

#### Installation

```bash
npm install @nozbe/watermelondb @nozbe/with-observables
# For React Native
npm install react-native-sqlite-storage
# For Expo
npx expo install expo-sqlite
```

#### Profile Model

```typescript
// models/Profile.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Profile extends Model {
  static table = 'profiles';

  @field('uuid') uuid!: string;
  @field('name') name!: string;
  @readonly @date('created_date') createdAt!: Date;

  static maxNameLength = 96;

  static async createDefaultProfile(database: Database) {
    const profiles = database.collections.get<Profile>('profiles');
    await profiles.create((profile) => {
      profile.uuid = uuidv4();
      profile.name = 'Default Profile';
    });
  }
}
```

#### Transaction Model

```typescript
// models/Transaction.ts
import { Model, Associations } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import Account from './Account';
import Category from './Category';

export default class Transaction extends Model {
  static table = 'transactions';
  static associations: Associations = {
    accounts: { type: 'belongs_to', key: 'account_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
  };

  @field('uuid') uuid!: string;
  @readonly @date('created_date') createdAt!: Date;
  @date('transaction_date') transactionDate!: Date;
  @field('is_deleted') isDeleted?: boolean;
  @date('deleted_date') deletedDate?: Date;
  @field('title') title?: string;
  @field('description') description?: string;
  @field('amount') amount!: number;
  @field('currency') currency!: string;
  @field('is_pending') isPending?: boolean;
  @field('subtype') subtype?: string;
  @field('extra') extra?: string;
  @field('extra_tags') extraTags!: string[];

  @relation('accounts', 'account_id') account!: Account;
  @relation('categories', 'category_id') category?: Category;

  static maxTitleLength = 256;
  static maxDescriptionLength = 65536;
}
```

#### Database Schema

```typescript
// database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'profiles',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'created_date', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'created_date', type: 'number' },
        { name: 'transaction_date', type: 'number' },
        { name: 'is_deleted', type: 'boolean' },
        { name: 'deleted_date', type: 'number', isOptional: true },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'amount', type: 'number' },
        { name: 'currency', type: 'string' },
        { name: 'is_pending', type: 'boolean', isOptional: true },
        { name: 'subtype', type: 'string', isOptional: true },
        { name: 'extra', type: 'string', isOptional: true },
        { name: 'extra_tags', type: 'string' }, // JSON string
        { name: 'account_id', type: 'string', isIndexed: true },
        { name: 'category_id', type: 'string', isIndexed: true, isOptional: true },
      ],
    }),
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'currency', type: 'string' },
        { name: 'created_date', type: 'number' },
        // ... other account fields
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'uuid', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        // ... other category fields
      ],
    }),
  ],
});
```

#### Database Setup

```typescript
// database/index.ts
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from './schema';
import Profile from '../models/Profile';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import Category from '../models/Category';

const adapter = new SQLiteAdapter({
  schema: mySchema,
  // migrations: migrations, // Add migrations as needed
  dbName: 'flow_db',
  jsi: true, // Use JSI for better performance (React Native only)
});

export const database = new Database({
  adapter,
  modelClasses: [Profile, Transaction, Account, Category],
});

// Initialize default profile if none exists
export async function initializeDatabase() {
  const profiles = database.collections.get<Profile>('profiles');
  const profileCount = await profiles.query().fetchCount();
  
  if (profileCount === 0) {
    await Profile.createDefaultProfile(database);
  }
}
```

#### Profile Service

```typescript
// services/ProfileService.ts
import { database } from '../database';
import Profile from '../models/Profile';
import { Q } from '@nozbe/watermelondb';

export class ProfileService {
  static async getProfile(): Promise<Profile | null> {
    const profiles = database.collections.get<Profile>('profiles');
    return await profiles.query().fetch();
  }

  static async getFirstProfile(): Promise<Profile | null> {
    const profiles = database.collections.get<Profile>('profiles');
    const allProfiles = await profiles.query().fetch();
    return allProfiles[0] || null;
  }

  static async createProfile(name: string): Promise<Profile> {
    const profiles = database.collections.get<Profile>('profiles');
    return await profiles.create((profile) => {
      profile.uuid = uuidv4();
      profile.name = name;
    });
  }

  static async updateProfile(profile: Profile, name: string): Promise<void> {
    await profile.update((p) => {
      p.name = name;
    });
  }

  static async saveProfile(name: string): Promise<Profile> {
    const existing = await this.getFirstProfile();
    
    if (existing) {
      await this.updateProfile(existing, name);
      return existing;
    } else {
      return await this.createProfile(name);
    }
  }
}
```

#### Transaction Service

```typescript
// services/TransactionService.ts
import { database } from '../database';
import Transaction from '../models/Transaction';
import Account from '../models/Account';
import { Q } from '@nozbe/watermelondb';

export class TransactionService {
  static async createTransaction(params: {
    amount: number;
    currency: string;
    accountId: string;
    categoryId?: string;
    title?: string;
    description?: string;
    transactionDate?: Date;
    isPending?: boolean;
    subtype?: string;
    extraTags?: string[];
  }): Promise<Transaction> {
    const transactions = database.collections.get<Transaction>('transactions');
    
    return await transactions.create((transaction) => {
      transaction.uuid = uuidv4();
      transaction.amount = params.amount;
      transaction.currency = params.currency;
      transaction.accountId = params.accountId;
      transaction.categoryId = params.categoryId;
      transaction.title = params.title;
      transaction.description = params.description;
      transaction.transactionDate = params.transactionDate || new Date();
      transaction.isPending = params.isPending || false;
      transaction.subtype = params.subtype;
      transaction.extraTags = params.extraTags || [];
    });
  }

  static async getAllTransactions(): Promise<Transaction[]> {
    const transactions = database.collections.get<Transaction>('transactions');
    return await transactions.query(
      Q.where('is_deleted', Q.notEq(true))
    ).fetch();
  }

  static async getTransactionById(id: string): Promise<Transaction | null> {
    const transactions = database.collections.get<Transaction>('transactions');
    const results = await transactions.query(
      Q.where('uuid', id)
    ).fetch();
    return results[0] || null;
  }

  static async updateTransaction(
    transaction: Transaction,
    updates: Partial<{
      title: string;
      description: string;
      amount: number;
      transactionDate: Date;
      isPending: boolean;
    }>
  ): Promise<void> {
    await transaction.update((t) => {
      if (updates.title !== undefined) t.title = updates.title;
      if (updates.description !== undefined) t.description = updates.description;
      if (updates.amount !== undefined) t.amount = updates.amount;
      if (updates.transactionDate !== undefined) t.transactionDate = updates.transactionDate;
      if (updates.isPending !== undefined) t.isPending = updates.isPending;
    });
  }

  static async deleteTransaction(transaction: Transaction): Promise<void> {
    await transaction.update((t) => {
      t.isDeleted = true;
      t.deletedDate = new Date();
    });
  }

  static async permanentlyDeleteTransaction(transaction: Transaction): Promise<void> {
    await transaction.markAsDeleted();
  }
}
```

#### Usage in React Components

```typescript
// components/ProfileSetup.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button } from 'react-native';
import { ProfileService } from '../services/ProfileService';
import { observe } from '@nozbe/watermelondb';
import Profile from '../models/Profile';

export function ProfileSetupScreen() {
  const [name, setName] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Observe profile changes reactively
    const subscription = observe(() => ProfileService.getFirstProfile())
      .subscribe(setProfile);

    return () => subscription.unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await ProfileService.saveProfile(name.trim());
      // Navigation handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        maxLength={Profile.maxNameLength}
      />
      <Button
        title="Save"
        onPress={handleSave}
        disabled={loading || !name.trim()}
      />
    </View>
  );
}
```

---

### Solution 2: SQLite (react-native-sqlite-storage)

Direct SQLite access with full control over queries and schema.

#### Installation

```bash
npm install react-native-sqlite-storage
# For Expo
npx expo install expo-sqlite
```

#### Database Setup

```typescript
// database/sqlite.ts
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'flow.db';
const database_version = '1.0';
const database_displayname = 'Flow Database';
const database_size = 200000;

export class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDB(): Promise<SQLite.SQLiteDatabase> {
    return new Promise((resolve, reject) => {
      SQLite.openDatabase(
        database_name,
        database_version,
        database_displayname,
        database_size
      )
        .then((db) => {
          this.db = db;
          this.createTables();
          this.initializeDefaultProfile();
          resolve(db);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    // Profiles table
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        created_date INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_profiles_uuid ON profiles(uuid);
    `);

    // Transactions table
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        created_date INTEGER NOT NULL,
        transaction_date INTEGER NOT NULL,
        is_deleted INTEGER DEFAULT 0,
        deleted_date INTEGER,
        title TEXT,
        description TEXT,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        is_pending INTEGER DEFAULT 0,
        subtype TEXT,
        extra TEXT,
        extra_tags TEXT,
        account_id TEXT NOT NULL,
        category_id TEXT,
        FOREIGN KEY (account_id) REFERENCES accounts(uuid),
        FOREIGN KEY (category_id) REFERENCES categories(uuid)
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_uuid ON transactions(uuid);
      CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_deleted ON transactions(is_deleted);
    `);

    // Accounts table
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        currency TEXT NOT NULL,
        created_date INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_accounts_uuid ON accounts(uuid);
    `);
  }

  private async initializeDefaultProfile(): Promise<void> {
    if (!this.db) return;

    const [results] = await this.db.executeSql(
      'SELECT COUNT(*) as count FROM profiles'
    );

    const count = results.rows.item(0).count;
    if (count === 0) {
      await this.db.executeSql(
        `INSERT INTO profiles (uuid, name, created_date) 
         VALUES (?, ?, ?)`,
        [uuidv4(), 'Default Profile', Date.now()]
      );
    }
  }

  getDB(): SQLite.SQLiteDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initDB() first.');
    }
    return this.db;
  }
}

export const dbService = new DatabaseService();
```

#### Profile Service (SQLite)

```typescript
// services/ProfileServiceSQLite.ts
import { dbService } from '../database/sqlite';

export interface Profile {
  id: number;
  uuid: string;
  name: string;
  createdDate: number;
}

export class ProfileService {
  static async getProfile(): Promise<Profile | null> {
    const db = dbService.getDB();
    const [results] = await db.executeSql(
      'SELECT * FROM profiles LIMIT 1'
    );

    if (results.rows.length > 0) {
      const row = results.rows.item(0);
      return {
        id: row.id,
        uuid: row.uuid,
        name: row.name,
        createdDate: row.created_date,
      };
    }
    return null;
  }

  static async createProfile(name: string): Promise<Profile> {
    const db = dbService.getDB();
    const uuid = uuidv4();
    const createdDate = Date.now();

    await db.executeSql(
      'INSERT INTO profiles (uuid, name, created_date) VALUES (?, ?, ?)',
      [uuid, name, createdDate]
    );

    const [results] = await db.executeSql(
      'SELECT * FROM profiles WHERE uuid = ?',
      [uuid]
    );

    const row = results.rows.item(0);
    return {
      id: row.id,
      uuid: row.uuid,
      name: row.name,
      createdDate: row.created_date,
    };
  }

  static async updateProfile(uuid: string, name: string): Promise<void> {
    const db = dbService.getDB();
    await db.executeSql(
      'UPDATE profiles SET name = ? WHERE uuid = ?',
      [name, uuid]
    );
  }

  static async saveProfile(name: string): Promise<Profile> {
    const existing = await this.getProfile();
    
    if (existing) {
      await this.updateProfile(existing.uuid, name);
      return { ...existing, name };
    } else {
      return await this.createProfile(name);
    }
  }
}
```

#### Transaction Service (SQLite)

```typescript
// services/TransactionServiceSQLite.ts
import { dbService } from '../database/sqlite';

export interface Transaction {
  id: number;
  uuid: string;
  createdDate: number;
  transactionDate: number;
  isDeleted: boolean;
  deletedDate?: number;
  title?: string;
  description?: string;
  amount: number;
  currency: string;
  isPending: boolean;
  subtype?: string;
  extra?: string;
  extraTags: string[];
  accountId: string;
  categoryId?: string;
}

export class TransactionService {
  static async createTransaction(params: {
    amount: number;
    currency: string;
    accountId: string;
    categoryId?: string;
    title?: string;
    description?: string;
    transactionDate?: Date;
    isPending?: boolean;
    subtype?: string;
    extraTags?: string[];
  }): Promise<Transaction> {
    const db = dbService.getDB();
    const uuid = uuidv4();
    const createdDate = Date.now();
    const transactionDate = params.transactionDate?.getTime() || Date.now();

    await db.executeSql(
      `INSERT INTO transactions (
        uuid, created_date, transaction_date, amount, currency,
        account_id, category_id, title, description, is_pending,
        subtype, extra, extra_tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        createdDate,
        transactionDate,
        params.amount,
        params.currency,
        params.accountId,
        params.categoryId || null,
        params.title || null,
        params.description || null,
        params.isPending ? 1 : 0,
        params.subtype || null,
        params.extra || null,
        JSON.stringify(params.extraTags || []),
      ]
    );

    const [results] = await db.executeSql(
      'SELECT * FROM transactions WHERE uuid = ?',
      [uuid]
    );

    const row = results.rows.item(0);
    return this.rowToTransaction(row);
  }

  static async getAllTransactions(): Promise<Transaction[]> {
    const db = dbService.getDB();
    const [results] = await db.executeSql(
      'SELECT * FROM transactions WHERE is_deleted = 0 ORDER BY transaction_date DESC'
    );

    const transactions: Transaction[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      transactions.push(this.rowToTransaction(results.rows.item(i)));
    }
    return transactions;
  }

  static async getTransactionById(uuid: string): Promise<Transaction | null> {
    const db = dbService.getDB();
    const [results] = await db.executeSql(
      'SELECT * FROM transactions WHERE uuid = ?',
      [uuid]
    );

    if (results.rows.length > 0) {
      return this.rowToTransaction(results.rows.item(0));
    }
    return null;
  }

  static async updateTransaction(
    uuid: string,
    updates: Partial<{
      title: string;
      description: string;
      amount: number;
      transactionDate: Date;
      isPending: boolean;
    }>
  ): Promise<void> {
    const db = dbService.getDB();
    const setClause: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
      setClause.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      setClause.push('description = ?');
      values.push(updates.description);
    }
    if (updates.amount !== undefined) {
      setClause.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.transactionDate !== undefined) {
      setClause.push('transaction_date = ?');
      values.push(updates.transactionDate.getTime());
    }
    if (updates.isPending !== undefined) {
      setClause.push('is_pending = ?');
      values.push(updates.isPending ? 1 : 0);
    }

    values.push(uuid);
    await db.executeSql(
      `UPDATE transactions SET ${setClause.join(', ')} WHERE uuid = ?`,
      values
    );
  }

  static async deleteTransaction(uuid: string): Promise<void> {
    const db = dbService.getDB();
    await db.executeSql(
      'UPDATE transactions SET is_deleted = 1, deleted_date = ? WHERE uuid = ?',
      [Date.now(), uuid]
    );
  }

  private static rowToTransaction(row: any): Transaction {
    return {
      id: row.id,
      uuid: row.uuid,
      createdDate: row.created_date,
      transactionDate: row.transaction_date,
      isDeleted: row.is_deleted === 1,
      deletedDate: row.deleted_date,
      title: row.title,
      description: row.description,
      amount: row.amount,
      currency: row.currency,
      isPending: row.is_pending === 1,
      subtype: row.subtype,
      extra: row.extra,
      extraTags: row.extra_tags ? JSON.parse(row.extra_tags) : [],
      accountId: row.account_id,
      categoryId: row.category_id,
    };
  }
}
```

---

### Solution 3: MMKV (For Simple Key-Value Storage)

MMKV is excellent for preferences and simple data, but not ideal for complex relational data like transactions.

#### Installation

```bash
npm install react-native-mmkv
```

#### Setup

```typescript
// storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'flow-storage',
  encryptionKey: 'your-encryption-key-here', // Optional
});

// Profile storage
export const ProfileStorage = {
  getProfile: (): { uuid: string; name: string; createdDate: number } | null => {
    const profileJson = storage.getString('profile');
    return profileJson ? JSON.parse(profileJson) : null;
  },

  saveProfile: (name: string): void => {
    const profile = {
      uuid: uuidv4(),
      name,
      createdDate: Date.now(),
    };
    storage.set('profile', JSON.stringify(profile));
  },

  updateProfile: (name: string): void => {
    const existing = this.getProfile();
    if (existing) {
      const updated = { ...existing, name };
      storage.set('profile', JSON.stringify(updated));
    }
  },
};

// For transactions, MMKV is not recommended due to complexity
// Use SQLite or WatermelonDB instead
```

**Note**: MMKV is not suitable for storing transactions due to:
- No relational queries
- No complex filtering
- Limited to key-value pairs
- No foreign key relationships

---

## Comparison Table

| Feature | WatermelonDB | SQLite | MMKV |
|---------|-------------|--------|------|
| **Complex Queries** | ✅ Excellent | ✅ Excellent | ❌ No |
| **Relationships** | ✅ Built-in | ✅ Manual | ❌ No |
| **Reactive Updates** | ✅ Yes | ❌ Manual | ❌ Manual |
| **Performance** | ✅ Very Good | ✅ Excellent | ✅ Excellent |
| **Setup Complexity** | Medium | High | Low |
| **Type Safety** | ✅ Yes | ❌ Manual | ❌ Manual |
| **Migrations** | ✅ Built-in | ✅ Manual | ❌ No |
| **Best For** | Complex apps | Full control | Simple data |

## Recommendation

**Use WatermelonDB** for this app because:
1. Closest to ObjectBox architecture
2. Handles complex relationships (transactions, accounts, categories)
3. Reactive queries for real-time UI updates
4. Built-in migrations
5. Type-safe models

**Use MMKV** for:
- User preferences
- Simple settings
- Cache data

**Use SQLite** if you need:
- Full SQL control
- Complex custom queries
- Maximum performance

## Migration Path

1. **Start with WatermelonDB** for main data (profiles, transactions, accounts, categories)
2. **Use MMKV** for simple preferences (theme, locale, etc.)
3. **Gradually migrate** from Flutter ObjectBox models to WatermelonDB models
4. **Test thoroughly** with real data volumes

## Example: Complete Setup with WatermelonDB

```typescript
// App.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { database, initializeDatabase } from './database';
import { ProfileService } from './services/ProfileService';

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initializeDatabase();
        setInitialized(true);
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    }
    init();
  }, []);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // Your app components
  );
}
```

---

## Additional Resources

- [WatermelonDB Documentation](https://nozbe.github.io/WatermelonDB/)
- [react-native-sqlite-storage](https://github.com/andpor/react-native-sqlite-storage)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)

