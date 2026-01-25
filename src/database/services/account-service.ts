import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type Account from "../models/Account"

/**
 * Account Service
 *
 * Provides functions for managing account data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the accounts collection
 */
function getAccountCollection() {
  return database.get<Account>("accounts")
}

/**
 * Get all accounts
 */
export async function getAccounts(includeArchived = false): Promise<Account[]> {
  const accounts = getAccountCollection()
  if (includeArchived) {
    return await accounts.query().fetch()
  }
  return await accounts.query(Q.where("is_archived", false)).fetch()
}

/**
 * Find an account by ID
 */
export async function findAccount(id: string): Promise<Account | null> {
  try {
    return await getAccountCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe all accounts reactively
 */
export function observeAccounts(includeArchived = false) {
  const accounts = getAccountCollection()
  if (includeArchived) {
    return accounts.query().observe()
  }
  return accounts.query(Q.where("is_archived", false)).observe()
}

/**
 * Observe a specific account by ID
 */
export function observeAccountById(id: string) {
  return getAccountCollection().findAndObserve(id)
}

/**
 * Create a new account
 */
export async function createAccount(data: {
  name: string
  type: string
  balance: number
  currencyCode: string
  icon?: string
  color?: string
}): Promise<Account> {
  return await database.write(async () => {
    return await getAccountCollection().create((account) => {
      account.name = data.name
      account.type = data.type
      account.balance = data.balance
      account.currencyCode = data.currencyCode
      account.icon = data.icon
      account.color = data.color
      account.isArchived = false
      account.createdAt = new Date()
      account.updatedAt = new Date()
    })
  })
}

/**
 * Update account
 */
export async function updateAccount(
  account: Account,
  updates: Partial<{
    name: string
    type: string
    balance: number
    currencyCode: string
    icon: string | undefined
    color: string | undefined
    isArchived: boolean
  }>,
): Promise<Account> {
  return await database.write(async () => {
    return await account.update((a) => {
      if (updates.name !== undefined) a.name = updates.name
      if (updates.type !== undefined) a.type = updates.type
      if (updates.balance !== undefined) a.balance = updates.balance
      if (updates.currencyCode !== undefined)
        a.currencyCode = updates.currencyCode
      if (updates.icon !== undefined) a.icon = updates.icon
      if (updates.color !== undefined) a.color = updates.color
      if (updates.isArchived !== undefined) a.isArchived = updates.isArchived
      a.updatedAt = new Date()
    })
  })
}

/**
 * Update account by ID
 */
export async function updateAccountById(
  id: string,
  updates: Partial<{
    name: string
    type: string
    balance: number
    currencyCode: string
    icon: string | undefined
    color: string | undefined
    isArchived: boolean
  }>,
): Promise<Account> {
  const account = await findAccount(id)
  if (!account) {
    throw new Error(`Account with id ${id} not found`)
  }
  return await updateAccount(account, updates)
}

/**
 * Delete account (mark as deleted for sync)
 */
export async function deleteAccount(account: Account): Promise<void> {
  await database.write(async () => {
    await account.markAsDeleted()
  })
}

/**
 * Permanently destroy account
 */
export async function destroyAccount(account: Account): Promise<void> {
  await database.write(async () => {
    await account.destroyPermanently()
  })
}
