import { Operation } from "~/types/calculator"

/**
 * Performs a mathematical operation between two numbers.
 *
 * @param operation - The operation to perform (PLUS, MINUS, MULTIPLY, DIVIDE, PERCENT)
 * @param currentValue - The current value (left operand)
 * @param inputValue - The input value (right operand)
 * @returns The result of the operation, or 0 if division by zero is attempted
 *
 * @remarks
 * - Division by zero shows an error toast and returns 0
 * - PERCENT calculates percentage: (currentValue * inputValue) / 100
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
        // TODO: Implement toast notification
        return 0
      }
      return currentValue / inputValue
    case Operation.PERCENT:
      return (currentValue * inputValue) / 100
    default:
      return inputValue
  }
}
