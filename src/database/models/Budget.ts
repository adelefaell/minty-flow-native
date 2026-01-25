import { Model } from "@nozbe/watermelondb"
import { date, field, relation } from "@nozbe/watermelondb/decorators"

import type Category from "./Category"

/**
 * Budget model representing budget limits.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 * - Relations use _id suffix for foreign keys
 */
export default class Budget extends Model {
  static table = "budgets"

  @field("name") name!: string
  @field("amount") amount!: number
  @field("spent_amount") spentAmount!: number
  @field("currency_code") currencyCode!: string
  @field("period") period!: "daily" | "weekly" | "monthly" | "yearly" | "custom"
  @date("start_date") startDate!: Date
  @date("end_date") endDate?: Date
  @field("category_id") categoryId?: string
  @relation("categories", "category_id") category?: Category
  @field("alert_threshold") alertThreshold?: number
  @field("is_active") isActive!: boolean
  @field("is_archived") isArchived!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the remaining amount in the budget.
   */
  get remainingAmount(): number {
    return Math.max(0, this.amount - this.spentAmount)
  }

  /**
   * Gets the spending percentage (0-100+).
   */
  get spentPercentage(): number {
    if (this.amount === 0) return 0
    return (this.spentAmount / this.amount) * 100
  }

  /**
   * Checks if the budget has exceeded the alert threshold.
   */
  get isAboveAlertThreshold(): boolean {
    if (!this.alertThreshold) return false
    return this.spentPercentage >= this.alertThreshold
  }

  /**
   * Checks if the budget has been exceeded.
   */
  get isExceeded(): boolean {
    return this.spentAmount > this.amount
  }

  /**
   * Checks if the budget is currently active based on dates.
   */
  get isCurrentlyActive(): boolean {
    if (!this.isActive) return false
    const now = new Date()
    if (now < this.startDate) return false
    if (this.endDate && now > this.endDate) return false
    return true
  }
}
