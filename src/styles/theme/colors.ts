// ============================================================================
// Minty Theming System - React Native + Unistyles Implementation
// ============================================================================

/**
 * Color entry with associated theme names
 */
export interface ColorEntry {
  color: string
  lightThemeName: string
  darkThemeName: string
}

/**
 * Primary colors (16 colors) - darker, saturated for light themes
 * Generated with hue rotation pattern around color wheel
 * Each entry includes the color and its corresponding theme names
 */
export const PRIMARY_COLORS: readonly ColorEntry[] = [
  {
    color: "#8600a5",
    lightThemeName: "shadeOfViolet",
    darkThemeName: "electricLavender",
  },
  {
    color: "#a50086",
    lightThemeName: "blissfulBerry",
    darkThemeName: "pinkQuartz",
  },
  {
    color: "#a50048",
    lightThemeName: "cherryPlum",
    darkThemeName: "cottonCandy",
  },
  {
    color: "#a50024",
    lightThemeName: "crispChristmasCranberries",
    darkThemeName: "piglet",
  },
  {
    color: "#a52400",
    lightThemeName: "burntSienna",
    darkThemeName: "simplyDelicious",
  },
  {
    color: "#a54800",
    lightThemeName: "soilOfAvagddu",
    darkThemeName: "creamyApricot",
  },
  {
    color: "#a58600",
    lightThemeName: "flagGreen",
    darkThemeName: "yellYellow",
  },
  { color: "#86a500", lightThemeName: "tropicana", darkThemeName: "fallGreen" },
  {
    color: "#48a500",
    lightThemeName: "toyCamouflage",
    darkThemeName: "frostedMintHills",
  },
  {
    color: "#24a500",
    lightThemeName: "spreadsheetGreen",
    darkThemeName: "coastalTrim",
  },
  {
    color: "#00a524",
    lightThemeName: "tokiwaGreen",
    darkThemeName: "seafairGreen",
  },
  {
    color: "#00a548",
    lightThemeName: "hydraTurquoise",
    darkThemeName: "crushedIce",
  },
  {
    color: "#00a586",
    lightThemeName: "peacockBlue",
    darkThemeName: "iceEffect",
  },
  {
    color: "#0086a5",
    lightThemeName: "egyptianBlue",
    darkThemeName: "arcLight",
  },
  {
    color: "#0048a5",
    lightThemeName: "bohemianBlue",
    darkThemeName: "driedLilac",
  },
  {
    color: "#0024a5",
    lightThemeName: "spaceBattleBlue",
    darkThemeName: "neonBoneyard",
  },
] as const

/**
 * Accent colors (16 colors) - lighter, pastel versions
 * Each has 1:1 correspondence with primary colors at same index
 * Used as secondary colors in light themes
 */
export const ACCENT_COLORS: readonly ColorEntry[] = [
  {
    color: "#f5ccff",
    lightThemeName: "shadeOfViolet",
    darkThemeName: "electricLavender",
  },
  {
    color: "#ffccf5",
    lightThemeName: "blissfulBerry",
    darkThemeName: "pinkQuartz",
  },
  {
    color: "#ffcce2",
    lightThemeName: "cherryPlum",
    darkThemeName: "cottonCandy",
  },
  {
    color: "#ffccd4",
    lightThemeName: "crispChristmasCranberries",
    darkThemeName: "piglet",
  },
  {
    color: "#ffd4cc",
    lightThemeName: "burntSienna",
    darkThemeName: "simplyDelicious",
  },
  {
    color: "#ffe2cc",
    lightThemeName: "soilOfAvagddu",
    darkThemeName: "creamyApricot",
  },
  {
    color: "#fff5cc",
    lightThemeName: "flagGreen",
    darkThemeName: "yellYellow",
  },
  { color: "#f5ffcc", lightThemeName: "tropicana", darkThemeName: "fallGreen" },
  {
    color: "#e2ffcc",
    lightThemeName: "toyCamouflage",
    darkThemeName: "frostedMintHills",
  },
  {
    color: "#d4ffcc",
    lightThemeName: "spreadsheetGreen",
    darkThemeName: "coastalTrim",
  },
  {
    color: "#ccffd4",
    lightThemeName: "tokiwaGreen",
    darkThemeName: "seafairGreen",
  },
  {
    color: "#ccffe2",
    lightThemeName: "hydraTurquoise",
    darkThemeName: "crushedIce",
  },
  {
    color: "#ccfff5",
    lightThemeName: "peacockBlue",
    darkThemeName: "iceEffect",
  },
  {
    color: "#ccf5ff",
    lightThemeName: "egyptianBlue",
    darkThemeName: "arcLight",
  },
  {
    color: "#cce2ff",
    lightThemeName: "bohemianBlue",
    darkThemeName: "driedLilac",
  },
  {
    color: "#ccd4ff",
    lightThemeName: "spaceBattleBlue",
    darkThemeName: "neonBoneyard",
  },
] as const
