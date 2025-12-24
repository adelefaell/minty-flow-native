import { Operation } from "~/types/calculator"

/**
 * Performs a mathematical operation between two numbers.
 *
 * @param operation - The operation to perform (PLUS, MINUS, MULTIPLY, DIVIDE, PERCENT)
 * @param currentValue - The current value (left operand)
 * @param inputValue - The input value (right operand)
 * @returns The result of the operation, or NaN if division by zero is attempted
 *
 * @remarks
 * - Division by zero returns NaN (caller should handle this appropriately)
 * - PERCENT calculates percentage: (currentValue * inputValue) / 100
 *   Example: 100 % 20 = 20 (20% of 100)
 * - If operation is null, returns inputValue
 */
export const calculateOperation = (
  operation: Operation | null,
  currentValue: number,
  inputValue: number,
): number => {
  switch (operation) {
    case Operation.PLUS:
      return currentValue + inputValue
    case Operation.MINUS:
      return currentValue - inputValue
    case Operation.MULTIPLY:
      return currentValue * inputValue
    case Operation.DIVIDE:
      if (inputValue === 0) {
        // TODO Implement error toast
        // Return NaN to indicate division by zero error
        // The caller should handle this appropriately
        return Number.NaN
      }
      return currentValue / inputValue
    case Operation.PERCENT:
      return (currentValue * inputValue) / 100
    default:
      return inputValue
  }
}
