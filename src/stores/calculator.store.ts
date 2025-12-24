import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { useAmountFormattingStore } from "~/stores/amount-formatting.store"
import type { CalculatorStore, Operation } from "~/types/calculator"
import { calculateOperation } from "~/utils/calculate-operations"
import {
  CALCULATOR_CONFIG,
  formatDisplayValue,
  getDefaultLocale,
  isValidDisplay,
  normalizeDisplay,
  roundToDecimals,
} from "~/utils/number-format"

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
            const newDisplay = state.display.slice(0, -1)
            // Normalize after backspace to handle cases like "0." -> "0"
            const normalized = normalizeDisplay(newDisplay)
            state.display = normalized
            state.inputValue = parseFloat(normalized) || 0
            return
          }
          state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
          state.inputValue = 0
        }, false)
      },

      toggleSign: () => {
        set((state) => {
          const currentValue = state.inputValue
          if (currentValue === 0) return // Don't toggle zero

          const newValue = -currentValue
          state.inputValue = newValue

          // Reconstruct display string from the new numeric value, preserving decimal format
          const hasDecimal = state.display.includes(".")
          const isTrailingDecimal = state.display.endsWith(".")

          if (isTrailingDecimal) {
            // Preserve trailing decimal point: "5." -> "-5." or "-5." -> "5."
            const absValue = Math.abs(newValue)
            state.display = newValue < 0 ? `-${absValue}.` : `${absValue}.`
          } else if (hasDecimal) {
            // Preserve decimal places: "5.23" -> "-5.23" or "-5.23" -> "5.23"
            // Get decimal part from original display
            const decimalMatch = state.display.match(/\.(\d*)$/)
            const decimalPart = decimalMatch?.[1] || ""

            // Use the new numeric value to get the integer part
            const absValue = Math.abs(newValue)
            const integerPart = Math.floor(absValue).toString()

            state.display =
              newValue < 0
                ? `-${integerPart}.${decimalPart}`
                : `${integerPart}.${decimalPart}`
          } else {
            // Simple integer: "5" -> "-5" or "-5" -> "5"
            state.display = newValue.toString()
          }
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

          // previousValue is guaranteed to be non-null here due to check above
          const currentValue = state.previousValue
          const result = calculateOperation(
            state.operation as Operation,
            currentValue,
            inputValue,
          )

          // Check for division by zero or invalid result
          if (!Number.isFinite(result) || Number.isNaN(result)) {
            // Reset on error
            state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
            state.inputValue = 0
            state.previousValue = null
            state.operation = null
            state.waitingForOperand = false
            return
          }

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

          // Check for division by zero or invalid result
          if (!Number.isFinite(result) || Number.isNaN(result)) {
            state.display = CALCULATOR_CONFIG.DEFAULT_DISPLAY
            state.inputValue = 0
            state.previousValue = null
            state.operation = null
            state.waitingForOperand = false
            return
          }

          const rounded = roundToDecimals(
            result,
            CALCULATOR_CONFIG.MAX_DECIMALS,
          )
          // Convert to string, removing unnecessary trailing zeros
          // but preserving decimal point if it's a decimal number
          const displayStr = rounded.toString()
          state.display = displayStr
          state.inputValue = rounded
          state.previousValue = null
          state.operation = null
          state.waitingForOperand = true // Next number input should overwrite the result
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
