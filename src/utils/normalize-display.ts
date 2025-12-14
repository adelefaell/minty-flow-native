import { CALCULATOR_CONFIG } from "~/stores/calculator.store"

/**
 * Normalizes a calculator display string by removing leading zeros.
 *
 * @param display - The display string to normalize
 * @returns Normalized display string (preserves decimal point and trailing zeros)
 *
 * @example
 * ```ts
 * normalizeDisplay("000123") // Returns "123"
 * normalizeDisplay("000.45") // Returns "0.45"
 * normalizeDisplay("0") // Returns "0"
 * ```
 */
export const normalizeDisplay = (display: string): string => {
  if (display.includes(".")) {
    const [integerPart, decimalPart] = display.split(".")
    const normalizedInteger = integerPart.replace(/^0+/, "") || "0"
    return `${normalizedInteger}.${decimalPart}`
  }
  return display.replace(/^0+/, "") || "0"
}

/**
 * Validates a calculator display string against configuration limits.
 *
 * @param display - The display string to validate
 * @returns True if the display is valid (within decimal places and total digits limits)
 *
 * @remarks
 * Checks:
 * - Maximum decimal places (from CALCULATOR_CONFIG.MAX_DECIMALS)
 * - Maximum total digits (from CALCULATOR_CONFIG.MAX_DIGITS)
 */
export const isValidDisplay = (display: string): boolean => {
  // Check decimal places limit
  if (display.includes(".")) {
    const decimalParts = display.split(".")
    if (
      decimalParts[1] &&
      decimalParts[1].length > CALCULATOR_CONFIG.MAX_DECIMALS
    ) {
      return false
    }
  }

  // Check total digits limit
  if (display.replace(/\./g, "").length > CALCULATOR_CONFIG.MAX_DIGITS) {
    return false
  }

  return true
}
