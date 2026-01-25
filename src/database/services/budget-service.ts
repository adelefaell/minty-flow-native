import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type Budget from "../models/Budget"
import type Category from "../models/Category"

/**
 * Budget Service
 *
 * Provides functions for managing budget data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the budgets collection
 */
function getBudgetCollection() {
  return database.get<Budget>("budgets")
}

/**
 * Get budgets with optional filters
 */
export async function getBudgets(filters?: {
  isActive?: boolean
  includeArchived?: boolean
}): Promise<Budget[]> {
  const budgets = getBudgetCollection()
  let query = budgets.query()

  if (filters?.isActive !== undefined) {
    query = query.extend(Q.where("is_active", filters.isActive))
  }
  if (!filters?.includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  return await query.fetch()
}

/**
 * Find a budget by ID
 */
export async function findBudget(id: string): Promise<Budget | null> {
  try {
    return await getBudgetCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe budgets reactively with optional filters
 */
export function observeBudgets(filters?: {
  isActive?: boolean
  includeArchived?: boolean
}) {
  const budgets = getBudgetCollection()
  let query = budgets.query()

  if (filters?.isActive !== undefined) {
    query = query.extend(Q.where("is_active", filters.isActive))
  }
  if (!filters?.includeArchived) {
    query = query.extend(Q.where("is_archived", false))
  }

  return query.observe()
}

/**
 * Observe a specific budget by ID
 */
export function observeBudgetById(id: string) {
  return getBudgetCollection().findAndObserve(id)
}

/**
 * Create a new budget
 */
export async function createBudget(data: {
  name: string
  amount: number
  currencyCode: string
  period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
  startDate: Date
  endDate?: Date
  categoryId?: string
  alertThreshold?: number
}): Promise<Budget> {
  const budgets = getBudgetCollection()

  return await database.write(async () => {
    // Validate category if provided
    if (data.categoryId) {
      const categories = database.get<Category>("categories")
      const category = await categories.find(data.categoryId)
      if (!category) {
        throw new Error(`Category with id ${data.categoryId} not found`)
      }
    }

    return await budgets.create((budget) => {
      budget.name = data.name
      budget.amount = data.amount
      budget.spentAmount = 0
      budget.currencyCode = data.currencyCode
      budget.period = data.period
      budget.startDate = data.startDate
      budget.endDate = data.endDate
      budget.categoryId = data.categoryId
      budget.alertThreshold = data.alertThreshold
      budget.isActive = true
      budget.isArchived = false
      budget.createdAt = new Date()
      budget.updatedAt = new Date()
    })
  })
}

/**
 * Update budget
 */
export async function updateBudget(
  budget: Budget,
  updates: Partial<{
    name: string
    amount: number
    spentAmount: number
    period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
    startDate: Date
    endDate: Date | undefined
    alertThreshold: number | undefined
    isActive: boolean
    isArchived: boolean
  }>,
): Promise<Budget> {
  return await database.write(async () => {
    return await budget.update((b) => {
      if (updates.name !== undefined) b.name = updates.name
      if (updates.amount !== undefined) b.amount = updates.amount
      if (updates.spentAmount !== undefined) b.spentAmount = updates.spentAmount
      if (updates.period !== undefined) b.period = updates.period
      if (updates.startDate !== undefined) b.startDate = updates.startDate
      if (updates.endDate !== undefined) b.endDate = updates.endDate
      if (updates.alertThreshold !== undefined)
        b.alertThreshold = updates.alertThreshold
      if (updates.isActive !== undefined) b.isActive = updates.isActive
      if (updates.isArchived !== undefined) b.isArchived = updates.isArchived
      b.updatedAt = new Date()
    })
  })
}

/**
 * Update budget by ID
 */
export async function updateBudgetById(
  id: string,
  updates: Partial<{
    name: string
    amount: number
    spentAmount: number
    period: "daily" | "weekly" | "monthly" | "yearly" | "custom"
    startDate: Date
    endDate: Date | undefined
    alertThreshold: number | undefined
    isActive: boolean
    isArchived: boolean
  }>,
): Promise<Budget> {
  const budget = await findBudget(id)
  if (!budget) {
    throw new Error(`Budget with id ${id} not found`)
  }
  return await updateBudget(budget, updates)
}

/**
 * Add spending to budget
 */
export async function addSpending(
  budget: Budget,
  amount: number,
): Promise<Budget> {
  return await updateBudget(budget, {
    spentAmount: budget.spentAmount + amount,
  })
}

/**
 * Reset budget spent amount
 */
export async function resetBudgetSpending(budget: Budget): Promise<Budget> {
  return await updateBudget(budget, { spentAmount: 0 })
}

/**
 * Delete budget (mark as deleted for sync)
 */
export async function deleteBudget(budget: Budget): Promise<void> {
  await database.write(async () => {
    await budget.markAsDeleted()
  })
}

/**
 * Permanently destroy budget
 */
export async function destroyBudget(budget: Budget): Promise<void> {
  await database.write(async () => {
    await budget.destroyPermanently()
  })
}
