import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { useAmountFormattingStore } from "~/stores/amount-formatting.store"
import type { CalculatorStore, Operation } from "~/types/calculator"
import { calculateOperation } from "~/utils/calculate-operations"
import { isValidDisplay, normalizeDisplay } from "~/utils/normalize-display"
import {
  getDefaultLocale,
  numberFormatter,
  roundToDecimals,
} from "~/utils/number-format"

// Constants
export const CALCULATOR_CONFIG = {
  MAX_DIGITS: 14,
  MAX_DECIMALS: 2,
  DEFAULT_DISPLAY: "0",
} as const

// ------------------------
// Formatter memoization
// ------------------------
type FormatterKey = string
const formatterCache = new Map<FormatterKey, string>()

function getCachedFormatted(
  value: number,
  locale: string | undefined,
  options: Parameters<typeof numberFormatter>[1],
) {
  const resolvedLocale = locale ?? getDefaultLocale()
  const key = JSON.stringify({ locale: resolvedLocale, options, value })
  const cached = formatterCache.get(key)
  if (cached) return cached
  const formatted = numberFormatter(value, options, resolvedLocale)
  formatterCache.set(key, formatted)
  return formatted
}

// ------------------------
// Pure helper: formatDisplayValue
// ------------------------
/**
 * Pure, testable formatter for calculator displays.
 * - `currencyLook` is intentionally optional so callers can pass formatting
 *   preferences from UI-level stores and avoid cross-store calls in hot paths.
 */
export function formatDisplayValue(
  value: string,
  currency?: string,
  currencyLook?: Intl.NumberFormatOptions["currencyDisplay"],
  locale?: string,
) {
  const resolvedLocale = locale ?? getDefaultLocale()

  const baseOptions: Intl.NumberFormatOptions = {
    notation: "standard",
    signDisplay: "negative",
    minimumFractionDigits: 0,
    maximumFractionDigits: CALCULATOR_CONFIG.MAX_DECIMALS,
  }

  // Special handling when user types a trailing decimal point ("123.")
  if (value.endsWith(".")) {
    const numStr = value.slice(0, -1)
    // allow "." -> "0."
    const num = numStr === "" ? 0 : parseFloat(numStr)
    if (Number.isNaN(num)) return "0."

    if (currency) {
      const formatted = getCachedFormatted(num, resolvedLocale, {
        currency,
        currencyDisplay: currencyLook,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: baseOptions.notation,
        signDisplay: baseOptions.signDisplay,
      })
      return `${formatted}.`
    }

    const formatted = getCachedFormatted(num, resolvedLocale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: baseOptions.notation,
      signDisplay: baseOptions.signDisplay,
    })
    return `${formatted}.`
  }

  // Normal numeric parsing
  const num = parseFloat(value)
  if (Number.isNaN(num)) {
    // allow ".5" typed by the user to become "0.5"
    if (value === ".") return "0."
    return CALCULATOR_CONFIG.DEFAULT_DISPLAY
  }

  // Currency formatting (preferred path)
  if (currency) {
    // Preserve trailing zeros by counting decimal places in original value
    let minDecimals = 0

    if (value.includes(".")) {
      const decimalPart = value.split(".")[1]
      if (decimalPart !== undefined) {
        minDecimals = Math.min(
          decimalPart.length,
          CALCULATOR_CONFIG.MAX_DECIMALS,
        )
      }
    }

    return getCachedFormatted(num, resolvedLocale, {
      currency,
      currencyDisplay: currencyLook,
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: CALCULATOR_CONFIG.MAX_DECIMALS,
      notation: baseOptions.notation,
      signDisplay: baseOptions.signDisplay,
    })
  }

  // Non-currency: preserve trailing zeros and decimal point
  if (value.includes(".")) {
    const [integerPart, decimalPart] = value.split(".")
    if (
      decimalPart !== undefined && // Has decimal part (even if empty like "8.")
      integerPart !== "" &&
      !Number.isNaN(parseFloat(integerPart))
    ) {
      const formattedInteger = getCachedFormatted(
        parseFloat(integerPart),
        resolvedLocale,
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          notation: baseOptions.notation,
          signDisplay: baseOptions.signDisplay,
        },
      )
      return `${formattedInteger}.${decimalPart}`
    }
  }

  return getCachedFormatted(num, resolvedLocale, {
    minimumFractionDigits: baseOptions.minimumFractionDigits,
    maximumFractionDigits: baseOptions.maximumFractionDigits,
    notation: baseOptions.notation,
    signDisplay: baseOptions.signDisplay,
  })
}

// ------------------------
// Refactored store
// ------------------------
export const useCalculatorStore = create<CalculatorStore>()(
  devtools(
    immer((set, get) => ({
      // -- State (separate display text from numeric value) --
      display: CALCULATOR_CONFIG.DEFAULT_DISPLAY,
      // parsed numeric value of `display` (kept for convenience/performance)
      inputValue: 0,
      previousValue: null,
      operation: null,
      waitingForOperand: false,
      showCalculatorActions: false,

      // -- Actions --
      inputNumber: (num: string) => {
        set((state) => {
          if (state.waitingForOperand) {
            state.display = num
            state.inputValue = parseFloat(num) || 0
            state.waitingForOperand = false
            return
          }

          const newDisplay = normalizeDisplay(state.display + num)
          if (!isValidDisplay(newDisplay)) return

          state.display = newDisplay
          state.inputValue = parseFloat(newDisplay) || 0
        }, false)
      },

      inputDecimal: () => {
        set((state) => {
          if (state.waitingForOperand) {
            state.display = "0."
            state.inputValue = 0
            state.waitingForOperand = false
            return
          }
          if (state.display.includes(".")) return
          state.display = `${state.display}.`
        }, false)
      },

      clear: () => {
        set((state) => {
          if (state.operation !== null && state.previousValue !== null) {
            state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
            state.inputValue = 0
            state.waitingForOperand = true
            return
          }

          state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
          state.inputValue = 0
          state.previousValue = null
          state.operation = null
          state.waitingForOperand = false
        }, false)
      },

      backspace: () => {
        set((state) => {
          if (state.display.length > 1) {
            state.display = state.display.slice(0, -1)
            state.inputValue = parseFloat(state.display) || 0
            return
          }
          state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
          state.inputValue = 0
        }, false)
      },

      performOperation: (nextOperation: Operation) => {
        const { showCalculatorActions, toggleCalculatorActions } = get()
        if (!showCalculatorActions) toggleCalculatorActions()

        set((state) => {
          const inputValue = state.inputValue

          if (state.previousValue === null) {
            state.previousValue = inputValue
            state.operation = nextOperation
            state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
            state.inputValue = 0
            state.waitingForOperand = true
            return
          }

          const currentValue = state.previousValue || 0
          const result = calculateOperation(
            state.operation as Operation,
            currentValue,
            inputValue,
          )

          state.previousValue = roundToDecimals(
            result,
            CALCULATOR_CONFIG.MAX_DECIMALS,
          )
          state.operation = nextOperation
          state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
          state.inputValue = 0
          state.waitingForOperand = true
        }, false)
      },

      calculateResult: () => {
        set((state) => {
          if (state.previousValue === null || state.operation === null) return

          const inputValue = state.inputValue
          const currentValue = state.previousValue
          const result = calculateOperation(
            state.operation,
            currentValue,
            inputValue,
          )

          const rounded = roundToDecimals(
            result,
            CALCULATOR_CONFIG.MAX_DECIMALS,
          )
          state.display = rounded.toString()
          state.inputValue = rounded
          state.previousValue = null
          state.operation = null
          state.waitingForOperand = false
        }, false)
      },

      toggleCalculatorActions: () => {
        set((state) => {
          state.showCalculatorActions = !state.showCalculatorActions
        }, false)
      },

      reset: (initialValue = 0) => {
        set((state) => {
          state.display = initialValue.toString()
          state.inputValue = initialValue
          state.previousValue = null
          state.operation = null
          state.waitingForOperand = initialValue !== 0 // Set to true if there's an initial value
          state.showCalculatorActions = false
        }, false)
      },

      // Backwards-compatible formatDisplay helper: prefers injected currencyLook to avoid
      // a cross-store lookup in hot code paths. If not provided, falls back to the other store.
      formatDisplay: (
        value: string,
        currency?: string,
        currencyLook?: Intl.NumberFormatOptions["currencyDisplay"],
      ) => {
        const resolvedCurrencyLook =
          currencyLook ?? useAmountFormattingStore.getState().currencyLook
        // Pass explicit locale to make behavior deterministic and testable
        const locale = getDefaultLocale()
        return formatDisplayValue(value, currency, resolvedCurrencyLook, locale)
      },

      // Selectors
      getCurrentValue: () => {
        const state = get()
        return state.inputValue || 0
      },

      hasActiveOperation: () => {
        const state = get()
        return state.operation !== null && state.previousValue !== null
      },
    })) as Parameters<typeof devtools<CalculatorStore>>[0],
    { name: "calculator-store" },
  ),
)
