"use client"

import type { Dispatch, SetStateAction } from "react"
import { useCallback, useState } from "react"

/**
 * Return type for the useBoolean hook.
 */
type UseBooleanReturn = {
  /** Current boolean value */
  value: boolean
  /** Direct setter function */
  setValue: Dispatch<SetStateAction<boolean>>
  /** Sets value to true */
  setTrue: () => void
  /** Sets value to false */
  setFalse: () => void
  /** Toggles the boolean value */
  toggle: () => void
}

/**
 * Custom hook for managing boolean state with convenient helper methods.
 *
 * @param defaultValue - Initial boolean value (default: false)
 * @returns Object with value, setValue, setTrue, setFalse, and toggle methods
 *
 * @throws {Error} If defaultValue is not a boolean
 *
 * @example
 * ```ts
 * const { value, setTrue, setFalse, toggle } = useBoolean(false)
 * ```
 */
export const useBoolean = (defaultValue = false): UseBooleanReturn => {
  if (typeof defaultValue !== "boolean") {
    throw new Error("defaultValue must be `true` or `false`")
  }
  const [value, setValue] = useState(defaultValue)

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  const toggle = useCallback(() => {
    setValue((x) => !x)
  }, [])

  return { value, setValue, setTrue, setFalse, toggle }
}
