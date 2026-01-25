import { Model } from "@nozbe/watermelondb"
import { date, field, relation } from "@nozbe/watermelondb/decorators"

import type Account from "./Account"

/**
 * Loan model representing borrowed and lent money.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 * - Relations use _id suffix for foreign keys
 */
export default class Loan extends Model {
  static table = "loans"

  @field("name") name!: string
  @field("description") description?: string
  @field("principal_amount") principalAmount!: number
  @field("remaining_amount") remainingAmount!: number
  @field("interest_rate") interestRate?: number
  @field("currency_code") currencyCode!: string
  @field("loan_type") loanType!: "borrowed" | "lent"
  @field("contact_name") contactName?: string
  @field("contact_phone") contactPhone?: string
  @date("due_date") dueDate?: Date
  @field("account_id") accountId?: string
  @relation("accounts", "account_id") account?: Account
  @field("is_paid") isPaid!: boolean
  @field("is_archived") isArchived!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the paid amount.
   */
  get paidAmount(): number {
    return this.principalAmount - this.remainingAmount
  }

  /**
   * Gets the progress percentage (0-100).
   */
  get progressPercentage(): number {
    if (this.principalAmount === 0) return 0
    return Math.min(100, (this.paidAmount / this.principalAmount) * 100)
  }

  /**
   * Checks if the loan is overdue.
   */
  get isOverdue(): boolean {
    if (this.isPaid || !this.dueDate) return false
    return new Date() > this.dueDate
  }

  /**
   * Gets the total amount with interest.
   */
  get totalAmountWithInterest(): number {
    if (!this.interestRate) return this.principalAmount
    return this.principalAmount * (1 + this.interestRate / 100)
  }
}
