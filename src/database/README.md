# WatermelonDB Setup

This directory contains the WatermelonDB database setup for offline-first data storage.

## Structure

- `schema.ts` - Database schema definition with all tables and columns
- `models/` - Model classes for Profile, Category, Account, and Transaction
- `index.ts` - Database initialization and exports
- `services/` - Individual service files following WatermelonDB CRUD pattern
  - `profile-service.ts` - Profile operations
  - `account-service.ts` - Account operations
  - `category-service.ts` - Category operations
  - `transaction-service.ts` - Transaction operations
- `service.ts` - Legacy service (deprecated, use individual services instead)

## Usage

### Recommended: Individual Services (CRUD Pattern)

Each service follows the [WatermelonDB CRUD pattern](https://watermelondb.dev/docs/CRUD):

```typescript
import {
  getProfile,
  observeProfile,
  updateFirstProfile,
} from "~/database/services/profile-service"

// Get profile (async)
const profile = await getProfile()

// Observe profile reactively (for React components)
import { withObservables } from "@nozbe/watermelondb/react"
const enhance = withObservables([], () => ({
  profiles: observeProfile(),
}))

// Update profile
await updateFirstProfile({ name: "John Doe", imageUri: "..." })
```

### Profile Service

```typescript
import {
  getProfile,
  findProfile,
  observeProfile,
  observeProfileById,
  createProfile,
  updateProfile,
  updateProfileById,
  updateFirstProfile,
  deleteProfile,
  destroyProfile,
} from "~/database/services/profile-service"

// Get first profile
const profile = await getProfile()

// Find by ID
const profile = await findProfile("profile-id")

// Observe reactively
const observable = observeProfile()

// Create
const newProfile = await createProfile({ name: "John" })

// Update
await updateFirstProfile({ name: "Jane" })
```

### Account Service

```typescript
import {
  getAccounts,
  findAccount,
  observeAccounts,
  createAccount,
  updateAccount,
} from "~/database/services/account-service"

// Get all accounts
const accounts = await getAccounts()

// Observe accounts
const observable = observeAccounts()

// Create account
const account = await createAccount({
  name: "Checking",
  type: "checking",
  balance: 1000,
  currencyCode: "USD",
})
```

### Category Service

```typescript
import {
  getCategories,
  findCategory,
  observeCategories,
  createCategory,
  updateCategory,
} from "~/database/services/category-service"

// Get categories
const categories = await getCategories()

// Create category
const category = await createCategory({
  name: "Groceries",
  type: "expense",
  icon: "🛒",
})
```

### Transaction Service

```typescript
import {
  getTransactions,
  observeTransactions,
  createTransaction,
} from "~/database/services/transaction-service"

// Get transactions with filters
const transactions = await getTransactions({
  accountId: "account-id",
  type: "expense",
})

// Observe transactions
const observable = observeTransactions({ type: "expense" })

// Create transaction
const transaction = await createTransaction({
  amount: 50,
  currencyCode: "USD",
  type: "expense",
  date: new Date(),
  categoryId: "category-id",
  accountId: "account-id",
})
```

### Legacy Service (Deprecated)

The old `databaseService` is still available for backward compatibility but should be migrated to individual services:

```typescript
import { databaseService } from "~/database/service"

// Initialize (already done in _layout.tsx)
await databaseService.init()

// Get profile
const profile = await databaseService.getProfile()

// Update profile
await databaseService.updateProfile({ name: "John Doe" })
```

### Direct Database Access

For more complex queries, you can access the database directly:

```typescript
import { database } from "~/database"
import { Q } from "@nozbe/watermelondb"

const categories = database.collections.get("categories")
const expenseCategories = await categories
  .query(Q.where("type", "expense"))
  .fetch()
```

### Observing Changes with React Components

Use `withObservables` HOC to make components reactive:

```typescript
import { withObservables } from "@nozbe/watermelondb/react"
import { observeProfile } from "~/database/services/profile-service"

function MyComponent({ profiles }: { profiles: Profile[] }) {
  const profile = profiles[0]
  return <Text>{profile?.name}</Text>
}

const enhance = withObservables([], () => ({
  profiles: observeProfile(),
}))

export default enhance(MyComponent)
```

Or use the service's `observe*` functions directly:

```typescript
import { observeProfile } from "~/database/services/profile-service"

// Returns an Observable<Profile[]>
const observable = observeProfile()
```

## Models

### Profile
- `name`: string
- `imageUri`: string (optional)
- `createdAt`: Date
- `updatedAt`: Date

### Category
- `name`: string
- `type`: "expense" | "income" | "transfer"
- `icon`: string (optional)
- `color`: object (optional)
- `transactionCount`: number
- `isArchived`: boolean
- `createdAt`: Date
- `updatedAt`: Date

### Account
- `name`: string
- `type`: string
- `balance`: number
- `currencyCode`: string
- `icon`: string (optional)
- `color`: string (optional)
- `isArchived`: boolean
- `createdAt`: Date
- `updatedAt`: Date

### Transaction
- `amount`: number
- `currencyCode`: string
- `type`: "expense" | "income" | "transfer"
- `description`: string (optional)
- `date`: Date
- `categoryId`: string (relation)
- `accountId`: string (relation)
- `tags`: string[] (stored as JSON)
- `location`: object (stored as JSON, optional)
- `isPending`: boolean
- `isDeleted`: boolean
- `createdAt`: Date
- `updatedAt`: Date

## Notes

- The database is automatically initialized when the app starts (see `src/app/_layout.tsx`)
- JSI is enabled for better performance on React Native
- All database operations are asynchronous
- The database uses SQLite under the hood for offline storage
- Schema versioning and migrations can be added as the app evolves
