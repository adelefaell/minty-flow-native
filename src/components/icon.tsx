// Icon registry - only import the icons you actually use
// This prevents bundling all icons and keeps your app size small
import type { LucideIcon } from "lucide-react-native"
// Add your icons here as you need them
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  Bell,
  BookText,
  Camera,
  ChartPie,
  Check,
  ChevronRight,
  Circle,
  Clock,
  Coins,
  CreditCard,
  Delete,
  Divide,
  DollarSign,
  Equal,
  Eraser,
  EyeOff,
  GalleryVerticalEnd,
  Hash,
  Image,
  Info,
  Lock,
  MapPin,
  Minus,
  OctagonAlert,
  OctagonX,
  Paintbrush,
  Percent,
  Plus,
  Server,
  Settings,
  Shapes,
  Smartphone,
  Split,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  TriangleAlert,
  Unlock,
  Wallet,
  X,
} from "lucide-react-native"
import { useUnistyles } from "react-native-unistyles"

import { logger } from "~/utils/logger"

// Registry mapping icon names to their components
const iconRegistry = {
  // Basic shapes and navigation
  Circle,
  ChevronRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,

  // Actions
  Delete,
  Check,
  X,
  Plus,
  Minus,
  Percent,
  Divide,
  Equal,

  // Settings and configuration
  Settings,
  Target,
  Bell,
  Clock,
  BookText,
  Coins,

  // Finance and money
  DollarSign,
  CreditCard,
  Wallet,

  // Charts and data
  BarChart3,

  // Media
  Camera,
  Image,

  // UI elements
  Tag,
  Trash2,
  TrendingUp,

  // System and devices
  Server,
  Smartphone,

  // Other
  Paintbrush,
  EyeOff,
  Lock,
  Unlock,
  MapPin,
  Hash,
  Split,
  Eraser,
  Shapes,
  GalleryVerticalEnd,
  ChartPie,
  TriangleAlert,
  Info,
  OctagonAlert,
  OctagonX,
} as const

// Type for valid icon names (automatically inferred from registry)
export type IconName = keyof typeof iconRegistry

// Export valid icon names array (derived from registry)
export const VALID_ICON_NAMES = Object.keys(iconRegistry) as IconName[]

interface IconProps {
  name: IconName
  color?: string
  size?: number
  strokeWidth?: number
  absoluteStrokeWidth?: boolean
  [key: string]: unknown // Allow other SVG props
}

export const Icon = ({
  name,
  color,
  size,
  strokeWidth,
  absoluteStrokeWidth,
  ...props
}: IconProps) => {
  const { theme } = useUnistyles()
  const LucideIcon = iconRegistry[name] as LucideIcon

  if (!LucideIcon) {
    logger.warn(
      `Icon "${name}" not found in registry. Add it to the iconRegistry in icon.tsx`,
    )
    return null
  }

  return (
    <LucideIcon
      color={color ?? theme.colors.primary}
      size={size}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={absoluteStrokeWidth}
      {...props}
    />
  )
}
