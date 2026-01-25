import { Model } from "@nozbe/watermelondb"
import { date, field } from "@nozbe/watermelondb/decorators"

import type { CategoryType } from "../../types/categories"

/**
 * Category model representing transaction categories.
 *
 * Follows WatermelonDB schema patterns:
 * - Column names use snake_case
 * - Boolean fields start with is_
 * - Date fields end with _at and use number type (Unix timestamps)
 */
export default class Category extends Model {
  static table = "categories"

  @field("name") name!: string
  @field("type") type!: CategoryType
  @field("icon") icon?: string
  @field("color_name") colorName?: string
  @field("color_bg_class") colorBgClass?: string
  @field("color_text_class") colorTextClass?: string
  @field("color_border_class") colorBorderClass?: string
  @field("transaction_count") transactionCount!: number
  @field("is_archived") isArchived!: boolean
  @date("created_at") createdAt!: Date
  @date("updated_at") updatedAt!: Date

  /**
   * Gets the color object representation.
   */
  get color() {
    if (!this.colorName) return undefined
    return {
      name: this.colorName,
      bgClass: this.colorBgClass,
      textClass: this.colorTextClass,
      borderClass: this.colorBorderClass,
    }
  }

  /**
   * Sets the color object.
   */
  setColor(
    color:
      | {
          name: string
          bgClass?: string
          textClass?: string
          borderClass?: string
        }
      | undefined,
  ) {
    if (!color) {
      this.colorName = undefined
      this.colorBgClass = undefined
      this.colorTextClass = undefined
      this.colorBorderClass = undefined
      return
    }

    this.colorName = color.name
    this.colorBgClass = color.bgClass
    this.colorTextClass = color.textClass
    this.colorBorderClass = color.borderClass
  }
}
