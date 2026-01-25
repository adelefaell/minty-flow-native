import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type Account from "../models/Account"
import type Category from "../models/Category"
import type Transaction from "../models/Transaction"

/**
 * Transaction Service
 *
 * Provides functions for managing transaction data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the transactions collection
 */
function getTransactionCollection() {
  return database.get<Transaction>("transactions")
}

/**
 * Get transactions with optional filters
 */
export async function getTransactions(filters?: {
  accountId?: string
  categoryId?: string
  type?: "expense" | "income" | "transfer"
  isPending?: boolean
  includeDeleted?: boolean
}): Promise<Transaction[]> {
  const transactions = getTransactionCollection()
  let query = transactions.query()

  if (filters?.accountId) {
    query = query.extend(Q.where("account_id", filters.accountId))
  }
  if (filters?.categoryId) {
    query = query.extend(Q.where("category_id", filters.categoryId))
  }
  if (filters?.type) {
    query = query.extend(Q.where("type", filters.type))
  }
  if (filters?.isPending !== undefined) {
    query = query.extend(Q.where("is_pending", filters.isPending))
  }
  if (!filters?.includeDeleted) {
    query = query.extend(Q.where("is_deleted", false))
  }

  return await query.fetch()
}

/**
 * Find a transaction by ID
 */
export async function findTransaction(id: string): Promise<Transaction | null> {
  try {
    return await getTransactionCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe transactions reactively with optional filters
 */
export function observeTransactions(filters?: {
  accountId?: string
  categoryId?: string
  type?: "expense" | "income" | "transfer"
  isPending?: boolean
  includeDeleted?: boolean
}) {
  const transactions = getTransactionCollection()
  let query = transactions.query()

  if (filters?.accountId) {
    query = query.extend(Q.where("account_id", filters.accountId))
  }
  if (filters?.categoryId) {
    query = query.extend(Q.where("category_id", filters.categoryId))
  }
  if (filters?.type) {
    query = query.extend(Q.where("type", filters.type))
  }
  if (filters?.isPending !== undefined) {
    query = query.extend(Q.where("is_pending", filters.isPending))
  }
  if (!filters?.includeDeleted) {
    query = query.extend(Q.where("is_deleted", false))
  }

  return query.observe()
}

/**
 * Observe a specific transaction by ID
 */
export function observeTransactionById(id: string) {
  return getTransactionCollection().findAndObserve(id)
}

/**
 * Create a new transaction
 */
export async function createTransaction(data: {
  amount: number
  currencyCode: string
  type: "expense" | "income" | "transfer"
  date: Date
  categoryId: string
  accountId: string
  description?: string
  tags?: string[]
  location?: { latitude: number; longitude: number; address?: string }
  isPending?: boolean
}): Promise<Transaction> {
  const transactions = getTransactionCollection()
  const categories = database.get<Category>("categories")
  const accounts = database.get<Account>("accounts")

  return await database.write(async () => {
    // Fetch related models
    const category = await categories.find(data.categoryId)
    const account = await accounts.find(data.accountId)

    if (!category) {
      throw new Error(`Category with id ${data.categoryId} not found`)
    }
    if (!account) {
      throw new Error(`Account with id ${data.accountId} not found`)
    }

    const transaction = await transactions.create((t) => {
      t.amount = data.amount
      t.currencyCode = data.currencyCode
      t.type = data.type
      t.date = data.date
      // Set relations by assigning the model instances
      t.category = category
      t.account = account
      t.description = data.description
      t.isPending = data.isPending || false
      t.isDeleted = false
      t.createdAt = new Date()
      t.updatedAt = new Date()
      if (data.tags) {
        t.setTagsArray(data.tags)
      }
      if (data.location) {
        t.setLocationObject(data.location)
      }
    })

    // Update category transaction count
    await category.update((c) => {
      c.transactionCount += 1
      c.updatedAt = new Date()
    })

    return transaction
  })
}

/**
 * Update transaction
 */
export async function updateTransaction(
  transaction: Transaction,
  updates: Partial<{
    amount: number
    currencyCode: string
    type: "expense" | "income" | "transfer"
    date: Date
    description: string | undefined
    isPending: boolean
    categoryId: string
    accountId: string
  }>,
): Promise<Transaction> {
  return await database.write(async () => {
    return await transaction.update(async (t) => {
      if (updates.amount !== undefined) t.amount = updates.amount
      if (updates.currencyCode !== undefined)
        t.currencyCode = updates.currencyCode
      if (updates.type !== undefined) t.type = updates.type
      if (updates.date !== undefined) t.date = updates.date
      if (updates.description !== undefined) t.description = updates.description
      if (updates.isPending !== undefined) t.isPending = updates.isPending

      // Handle relation updates
      if (updates.categoryId) {
        const category = await database
          .get<Category>("categories")
          .find(updates.categoryId)
        if (category) {
          t.category = category
        }
      }
      if (updates.accountId) {
        const account = await database
          .get<Account>("accounts")
          .find(updates.accountId)
        if (account) {
          t.account = account
        }
      }

      t.updatedAt = new Date()
    })
  })
}

/**
 * Update transaction by ID
 */
export async function updateTransactionById(
  id: string,
  updates: Partial<{
    amount: number
    currencyCode: string
    type: "expense" | "income" | "transfer"
    date: Date
    description: string | undefined
    isPending: boolean
    categoryId: string
    accountId: string
  }>,
): Promise<Transaction> {
  const transaction = await findTransaction(id)
  if (!transaction) {
    throw new Error(`Transaction with id ${id} not found`)
  }
  return await updateTransaction(transaction, updates)
}

/**
 * Delete transaction (mark as deleted for sync)
 */
export async function deleteTransaction(
  transaction: Transaction,
): Promise<void> {
  await database.write(async () => {
    await transaction.markAsDeleted()
  })
}

/**
 * Permanently destroy transaction
 */
export async function destroyTransaction(
  transaction: Transaction,
): Promise<void> {
  await database.write(async () => {
    await transaction.destroyPermanently()
  })
}
