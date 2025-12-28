// ============================================================================
// Minty Theming System - Minty Theme Schemes
// ============================================================================

import {
  DEFAULT_DARK_BASE,
  DEFAULT_LIGHT_BASE,
  DEFAULT_OLED_BASE,
} from "../base"
import { ACCENT_COLORS, PRIMARY_COLORS } from "../colors"
import type { MintyColorScheme } from "../types"
import { copyWith, lightenColor } from "../utils"

/**
 * Minty Light themes - 16 variants based on primary colors
 * Pattern: Light surface with colored primary and pastel secondary
 * iconName matches name (descriptive color name)
 */
export const mintyLightSchemes: MintyColorScheme[] = PRIMARY_COLORS.map(
  (primaryEntry, index) =>
    copyWith(DEFAULT_LIGHT_BASE, {
      name: primaryEntry.lightThemeName,
      iconName: primaryEntry.lightThemeName, // Light themes use their own name as iconName
      primary: primaryEntry.color,
      secondary: ACCENT_COLORS[index].color,
    }),
)

/**
 * Minty Dark themes - 16 variants with lightened primary colors
 * Pattern: Dark gray surface with lightened primary and very dark secondary
 * iconName references the corresponding light theme
 */
export const mintyDarkSchemes: MintyColorScheme[] = PRIMARY_COLORS.map(
  (primaryEntry) =>
    copyWith(DEFAULT_DARK_BASE, {
      name: primaryEntry.darkThemeName,
      iconName: primaryEntry.lightThemeName, // Dark themes use corresponding light theme name as iconName
      primary: lightenColor(primaryEntry.color, 40),
    }),
)

/**
 * Minty OLED themes - 16 variants optimized for OLED displays
 * Pattern: True black surface with lightened primary
 * Name is dark theme name + "Oled" suffix
 * iconName matches the dark theme (not the OLED name)
 */
export const mintyOledSchemes: MintyColorScheme[] = PRIMARY_COLORS.map(
  (primaryEntry) =>
    copyWith(DEFAULT_OLED_BASE, {
      name: `${primaryEntry.darkThemeName}Oled`,
      iconName: primaryEntry.lightThemeName, // OLED themes use corresponding light theme name as iconName
      primary: lightenColor(primaryEntry.color, 40),
    }),
)
