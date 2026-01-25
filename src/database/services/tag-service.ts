import { Q } from "@nozbe/watermelondb"

import { database } from "../index"
import type Tag from "../models/Tag"

/**
 * Tag Service
 *
 * Provides functions for managing tag data.
 * Follows WatermelonDB CRUD pattern: https://watermelondb.dev/docs/CRUD
 */

/**
 * Get the tags collection
 */
function getTagCollection() {
  return database.get<Tag>("tags")
}

/**
 * Get all tags
 */
export async function getTags(includeArchived = false): Promise<Tag[]> {
  const tags = getTagCollection()
  if (includeArchived) {
    return await tags.query().fetch()
  }
  return await tags.query(Q.where("is_archived", false)).fetch()
}

/**
 * Find a tag by ID
 */
export async function findTag(id: string): Promise<Tag | null> {
  try {
    return await getTagCollection().find(id)
  } catch {
    return null
  }
}

/**
 * Observe all tags reactively
 */
export function observeTags(includeArchived = false) {
  const tags = getTagCollection()
  if (includeArchived) {
    return tags.query().observe()
  }
  return tags.query(Q.where("is_archived", false)).observe()
}

/**
 * Observe a specific tag by ID
 */
export function observeTagById(id: string) {
  return getTagCollection().findAndObserve(id)
}

/**
 * Create a new tag
 */
export async function createTag(data: {
  name: string
  color?: string
  icon?: string
}): Promise<Tag> {
  return await database.write(async () => {
    return await getTagCollection().create((tag) => {
      tag.name = data.name
      tag.color = data.color
      tag.icon = data.icon
      tag.usageCount = 0
      tag.isArchived = false
      tag.createdAt = new Date()
      tag.updatedAt = new Date()
    })
  })
}

/**
 * Update tag
 */
export async function updateTag(
  tag: Tag,
  updates: Partial<{
    name: string
    color: string | undefined
    icon: string | undefined
    usageCount: number
    isArchived: boolean
  }>,
): Promise<Tag> {
  return await database.write(async () => {
    return await tag.update((t) => {
      if (updates.name !== undefined) t.name = updates.name
      if (updates.color !== undefined) t.color = updates.color
      if (updates.icon !== undefined) t.icon = updates.icon
      if (updates.usageCount !== undefined) t.usageCount = updates.usageCount
      if (updates.isArchived !== undefined) t.isArchived = updates.isArchived
      t.updatedAt = new Date()
    })
  })
}

/**
 * Update tag by ID
 */
export async function updateTagById(
  id: string,
  updates: Partial<{
    name: string
    color: string | undefined
    icon: string | undefined
    usageCount: number
    isArchived: boolean
  }>,
): Promise<Tag> {
  const tag = await findTag(id)
  if (!tag) {
    throw new Error(`Tag with id ${id} not found`)
  }
  return await updateTag(tag, updates)
}

/**
 * Increment tag usage count
 */
export async function incrementTagUsage(tag: Tag): Promise<Tag> {
  return await updateTag(tag, { usageCount: tag.usageCount + 1 })
}

/**
 * Delete tag (mark as deleted for sync)
 */
export async function deleteTag(tag: Tag): Promise<void> {
  await database.write(async () => {
    await tag.markAsDeleted()
  })
}

/**
 * Permanently destroy tag
 */
export async function destroyTag(tag: Tag): Promise<void> {
  await database.write(async () => {
    await tag.destroyPermanently()
  })
}
