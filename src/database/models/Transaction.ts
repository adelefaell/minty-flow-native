import { Model } from "@nozbe/watermelondb"
import { date, field, relation } from "@nozbe/watermelondb/decorators"

import type { CategoryType } from "../../types/categories"
import type Account from "./Account"
import type Category from "./Category"

/**
 * Transaction model representing financial transactions.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 * - Relations use _id suffix for foreign keys
 */
export default class Transaction extends Model {
  static table = "transactions"

  @field("amount") amount!: number
  @field("currency_code") currencyCode!: string
  @field("type") type!: CategoryType
  @field("description") description?: string
  @date("date") date!: Date
  @field("category_id") categoryId!: string
  @field("account_id") accountId!: string
  @relation("categories", "category_id") category!: Category
  @relation("accounts", "account_id") account!: Account
  @field("tags") tags?: string // JSON array
  @field("location") location?: string // JSON object
  @field("is_pending") isPending!: boolean
  @field("is_deleted") isDeleted!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets tags as an array.
   */
  get tagsArray(): string[] {
    if (!this.tags) return []
    try {
      return JSON.parse(this.tags) as string[]
    } catch {
      return []
    }
  }

  /**
   * Sets tags from an array.
   */
  setTagsArray(tags: string[]) {
    this.tags = tags.length > 0 ? JSON.stringify(tags) : undefined
  }

  /**
   * Gets location as an object.
   */
  get locationObject():
    | { latitude: number; longitude: number; address?: string }
    | undefined {
    if (!this.location) return undefined
    try {
      return JSON.parse(this.location) as {
        latitude: number
        longitude: number
        address?: string
      }
    } catch {
      return undefined
    }
  }

  /**
   * Sets location from an object.
   */
  setLocationObject(
    location:
      | { latitude: number; longitude: number; address?: string }
      | undefined,
  ) {
    this.location = location ? JSON.stringify(location) : undefined
  }
}
