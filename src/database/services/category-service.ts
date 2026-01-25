import { Q } from "@nozbe/watermelondb"

import type { Category as CategoryType } from "../../types/categories"
import { database } from "../index"
import type Category from "../models/Category"

/**
 * Category Service
 *
 * Provides functions for managing category data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the categories collection
 */
function getCategoryCollection() {
  return database.get<Category>("categories")
}

/**
 * Get all categories
 */
export async function getCategories(
  includeArchived = false,
): Promise<Category[]> {
  const categories = getCategoryCollection()
  if (includeArchived) {
    return await categories.query().fetch()
  }
  return await categories.query(Q.where("is_archived", false)).fetch()
}

/**
 * Find a category by ID
 */
export async function findCategory(id: string): Promise<Category | null> {
  try {
    return await getCategoryCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe all categories reactively
 */
export function observeCategories(includeArchived = false) {
  const categories = getCategoryCollection()
  if (includeArchived) {
    return categories.query().observe()
  }
  return categories.query(Q.where("is_archived", false)).observe()
}

/**
 * Observe a specific category by ID
 */
export function observeCategoryById(id: string) {
  return getCategoryCollection().findAndObserve(id)
}

/**
 * Create a new category
 */
export async function createCategory(data: {
  name: string
  type: "expense" | "income" | "transfer"
  icon?: string
  color?: CategoryType["color"]
}): Promise<Category> {
  return await database.write(async () => {
    return await getCategoryCollection().create((category) => {
      category.name = data.name
      category.type = data.type
      category.icon = data.icon
      category.transactionCount = 0
      category.isArchived = false
      category.createdAt = new Date()
      category.updatedAt = new Date()
      if (data.color) {
        category.setColor(data.color)
      }
    })
  })
}

/**
 * Update category
 */
export async function updateCategory(
  category: Category,
  updates: Partial<{
    name: string
    icon: string | undefined
    color: CategoryType["color"]
    isArchived: boolean
  }>,
): Promise<Category> {
  return await database.write(async () => {
    return await category.update((c) => {
      if (updates.name !== undefined) c.name = updates.name
      if (updates.icon !== undefined) c.icon = updates.icon
      if (updates.color !== undefined) c.setColor(updates.color)
      if (updates.isArchived !== undefined) c.isArchived = updates.isArchived
      c.updatedAt = new Date()
    })
  })
}

/**
 * Update category by ID
 */
export async function updateCategoryById(
  id: string,
  updates: Partial<{
    name: string
    icon: string | undefined
    color: CategoryType["color"]
    isArchived: boolean
  }>,
): Promise<Category> {
  const category = await findCategory(id)
  if (!category) {
    throw new Error(`Category with id ${id} not found`)
  }
  return await updateCategory(category, updates)
}

/**
 * Delete category (mark as deleted for sync)
 */
export async function deleteCategory(category: Category): Promise<void> {
  await database.write(async () => {
    await category.markAsDeleted()
  })
}

/**
 * Permanently destroy category
 */
export async function destroyCategory(category: Category): Promise<void> {
  await database.write(async () => {
    await category.destroyPermanently()
  })
}
