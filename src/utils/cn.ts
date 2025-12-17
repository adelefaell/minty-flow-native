import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution.
 *
 * @remarks
 * Combines clsx for conditional classes and tailwind-merge for intelligent
 * Tailwind class merging (handles conflicts by keeping the last class).
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with resolved Tailwind conflicts
 *
 * @example
 * ```ts
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4" (px-2 is overridden by px-4)
 * cn("text-red-500", { "text-blue-500": isActive }) // Conditional classes
 * ```
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
