import * as Localization from "expo-localization"

import { currencyRegistryService } from "~/services/currency-registry"

const DEFAULT_LOCALE = "en-US"

/**
 * Gets the default locale for number formatting.
 *
 * @returns The browser's locale if available, otherwise "en-US"
 *
 * @remarks
 * Uses navigator.language in browser environments, falls back to DEFAULT_LOCALE on server.
 */
export const getDefaultLocale = (): string => {
  return Localization.getLocales()[0].languageTag ?? DEFAULT_LOCALE
}

const ZERO_WIDTH_SPACE = ""
// const ZERO_WIDTH_SPACE = "\u200B"

/**
 * Gets the currency label (symbol, code, or name) based on display preference.
 *
 * @param currency - The currency code (e.g., "USD", "EUR")
 * @param currencyDisplay - How to display the currency (symbol, code, or name)
 * @returns The currency label string
 * @internal
 */
const getCurrencyLabel = (
  currency: string,
  currencyDisplay: Intl.NumberFormatOptions["currencyDisplay"] = "symbol",
): string => {
  if (currencyDisplay === "code") {
    return currency
  }

  if (currencyDisplay === "name") {
    return currencyRegistryService.getCurrencyName(currency)
  }

  return currencyRegistryService.getCurrencySymbol(currency)
}

/**
 * Gets the sign prefix (+ or -) based on value and display options.
 *
 * @param signDisplay - How to display the sign (auto, always, never, exceptZero)
 * @param value - The numeric value
 * @returns The sign prefix string ("+", "-", or "")
 * @internal
 */
const getSignPrefix = (
  signDisplay: Intl.NumberFormatOptions["signDisplay"],
  value: number,
): string => {
  const isNegative = value < 0

  if (signDisplay === "never") {
    return ""
  }

  if (value === 0 && signDisplay === "exceptZero") {
    return ""
  }

  if (!isNegative && signDisplay !== "always" && signDisplay !== "exceptZero") {
    return ""
  }

  if (isNegative) {
    return "-"
  }

  return "+"
}

/**
 * Formats a number as a decimal with sign prefix.
 *
 * @param value - The number to format
 * @param resolvedLocale - The locale to use for formatting
 * @param options - Number formatting options
 * @returns Formatted decimal string with sign prefix
 * @internal
 */
const formatDecimal = (
  value: number,
  resolvedLocale: string,
  options: Intl.NumberFormatOptions,
): string => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    notation = "standard",
    signDisplay = "auto",
  } = options

  const signPrefix = getSignPrefix(signDisplay, value)
  const formatted = new Intl.NumberFormat(resolvedLocale, {
    style: "decimal",
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
  }).format(Math.abs(value))

  return `${signPrefix}${formatted}`
}

/**
 * Options for number formatting with currency support.
 */
export interface NumberFormatterOptions
  extends Omit<Intl.NumberFormatOptions, "style" | "currencySign"> {
  /**
   * When false, currency labels are omitted even if a currency is provided.
   * Useful when hiding symbols in UI while still formatting decimal digits.
   */
  showCurrency?: boolean
}

/**
 * Formats a number with optional currency display.
 *
 * @param value - The number to format
 * @param options - Formatting options including currency settings
 * @param locale - Optional locale override (defaults to browser locale)
 * @returns Formatted number string with optional currency symbol
 *
 * @example
 * ```ts
 * numberFormatter(1234.56, { currency: "USD" }) // "$1,234.56"
 * numberFormatter(1234.56, { currency: "USD", showCurrency: false }) // "1,234.56"
 * ```
 */
export const numberFormatter = (
  value: number,
  options: NumberFormatterOptions = {},
  locale?: string,
): string => {
  const {
    currency,
    currencyDisplay,
    showCurrency = true,
    signDisplay = "auto",
    ...decimalOptions
  } = options
  const resolvedLocale = locale ?? getDefaultLocale()
  const formattedNumber = formatDecimal(value, resolvedLocale, {
    ...decimalOptions,
    signDisplay,
  })

  if (!currency || !showCurrency) {
    return formattedNumber
  }

  const currencyLabel = getCurrencyLabel(currency, currencyDisplay)
  const currencyPosition: "prefix" | "suffix" = "prefix"

  // Extract sign prefix from formatted number if present
  const signMatch = formattedNumber.match(/^([+-]?)/)
  const signPrefix = signMatch?.[1] ?? ""
  const numberWithoutSign = formattedNumber.replace(/^[+-]/, "")

  if (currencyPosition === "prefix") {
    return `${signPrefix}${currencyLabel}${ZERO_WIDTH_SPACE}${numberWithoutSign}`
  }

  return `${signPrefix}${numberWithoutSign}${ZERO_WIDTH_SPACE}${currencyLabel}`
}

/**
 * Backward compatibility wrapper for numberFormatter.
 *
 * @param value - The number to format
 * @param options - Formatting options
 * @param locale - Optional locale override
 * @returns Formatted number string
 * @deprecated Use numberFormatter instead
 */
export const formatNumber = (
  value: number,
  options: NumberFormatterOptions = {},
  locale?: string,
): string => {
  return numberFormatter(value, options, locale)
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param num - The number to round
 * @param decimals - The number of decimal places (must be non-negative)
 * @returns The rounded number
 *
 * @example
 * ```ts
 * roundToDecimals(3.14159, 2) // Returns 3.14
 * roundToDecimals(3.14159, 0) // Returns 3
 * roundToDecimals(3.14159, 4) // Returns 3.1416
 * ```
 */
export const roundToDecimals = (num: number, decimals: number): number => {
  return Math.round(num * 10 ** decimals) / 10 ** decimals
}
