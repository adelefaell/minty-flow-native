import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet"
import type { LucideIcon } from "lucide-react-native"
// Import all icons from the /icons subpath for dynamic access
// Note: This increases bundle size but is necessary for icon selection
import * as lucideIcons from "lucide-react-native/icons"
import { useMemo, useState } from "react"
import { Alert, Pressable } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import {
  BottomSheetModalComponent,
  useBottomSheet,
} from "~/components/bottom-sheet"
import { Icon } from "~/components/icon"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface IconSelectionSheetProps {
  id: string
  onIconSelected?: (_icon: string) => void
}

// Curated list of commonly used icons relevant for a finance/budgeting app
const COMMON_ICON_NAMES = [
  // Finance & Money
  "DollarSign",
  "CreditCard",
  "Wallet",
  "Coins",
  "Banknote",
  "Receipt",
  "PiggyBank",
  "TrendingUp",
  "TrendingDown",
  "ArrowUpRight",
  "ArrowDownRight",
  "ArrowLeftRight",
  "PieChart",
  "BarChart",
  "LineChart",
  "Activity",
  "Target",
  "Award",
  "Gift",
  "Briefcase",
  "Building",
  "Building2",
  "Landmark",
  "Store",
  "ShoppingCart",
  "ShoppingBag",
  "ShoppingBasket",
  "Package",
  "Box",
  "Archive",
  "Inbox",
  "Save",
  "Download",
  "Upload",
  // Food & Dining
  "Utensils",
  "UtensilsCrossed",
  "Coffee",
  "CupSoda",
  "Beer",
  "Wine",
  "Apple",
  "Cherry",
  "Cookie",
  "IceCream",
  // Transportation
  "Car",
  "CarFront",
  "Bus",
  "Train",
  "Plane",
  "Bike",
  "Fuel",
  "Navigation",
  "MapPin",
  "Map",
  "Compass",
  // Home & Utilities
  "Home",
  "House",
  "Building",
  "Wrench",
  "Hammer",
  "Lightbulb",
  "Zap",
  "Droplet",
  "Thermometer",
  "Wind",
  "Cloud",
  "CloudRain",
  "Sun",
  "Moon",
  // Health & Fitness
  "Heart",
  "Activity",
  "Dumbbell",
  "Bike",
  "Running",
  "Stethoscope",
  "Pill",
  "Cross",
  "Shield",
  "ShieldCheck",
  // Entertainment & Leisure
  "Music",
  "Video",
  "Film",
  "Gamepad2",
  "Tv",
  "Headphones",
  "Mic",
  "Camera",
  "Image",
  "Palette",
  "BookOpen",
  "Book",
  "Library",
  "Ticket",
  "PartyPopper",
  // Education & Work
  "GraduationCap",
  "BookOpen",
  "Book",
  "PenTool",
  "Pencil",
  "Highlighter",
  "Laptop",
  "Monitor",
  "Smartphone",
  "Tablet",
  "Printer",
  "FileText",
  "File",
  "Folder",
  "FolderOpen",
  "Clipboard",
  "ClipboardList",
  "Calendar",
  "Clock",
  "Timer",
  "AlarmClock",
  // Communication
  "Mail",
  "MessageCircle",
  "MessageSquare",
  "Phone",
  "PhoneCall",
  "Video",
  "Send",
  "Share",
  "Share2",
  "Link",
  "ExternalLink",
  "AtSign",
  "Hash",
  // Personal & Social
  "User",
  "Users",
  "UserPlus",
  "UserMinus",
  "UserCheck",
  "UserX",
  "Baby",
  "Heart",
  "HeartHandshake",
  "Handshake",
  "Smile",
  "Frown",
  // Actions & Controls
  "Plus",
  "Minus",
  "X",
  "Check",
  "CheckCircle",
  "XCircle",
  "Circle",
  "Square",
  "Triangle",
  "AlertCircle",
  "Info",
  "HelpCircle",
  "QuestionMark",
  "Exclamation",
  "Edit",
  "Edit2",
  "Edit3",
  "Trash",
  "Trash2",
  "Archive",
  "Copy",
  "Clipboard",
  "Scissors",
  "Search",
  "Filter",
  "Sliders",
  "Settings",
  "Cog",
  "MoreVertical",
  "MoreHorizontal",
  "Menu",
  "Grid",
  "List",
  "Layout",
  "Layers",
  // Navigation
  "ChevronRight",
  "ChevronLeft",
  "ChevronUp",
  "ChevronDown",
  "ArrowRight",
  "ArrowLeft",
  "ArrowUp",
  "ArrowDown",
  "ArrowUpRight",
  "ArrowDownRight",
  "ArrowUpLeft",
  "ArrowDownLeft",
  "Move",
  "Maximize",
  "Minimize",
  "ZoomIn",
  "ZoomOut",
  // Status & Feedback
  "Bell",
  "BellOff",
  "Star",
  "Bookmark",
  "Flag",
  "Tag",
  "Tags",
  "Lock",
  "Unlock",
  "Eye",
  "EyeOff",
  "Shield",
  "ShieldCheck",
  "ShieldAlert",
  "CheckCircle2",
  "XCircle",
  "AlertTriangle",
  "Info",
  "HelpCircle",
  // Technology
  "Wifi",
  "Bluetooth",
  "Battery",
  "BatteryCharging",
  "Power",
  "Zap",
  "Cpu",
  "HardDrive",
  "Server",
  "Database",
  "Code",
  "Terminal",
  "Command",
  "Globe",
  "Rss",
  "Cast",
  "Airplay",
  // Time & Date
  "Calendar",
  "Clock",
  "Timer",
  "AlarmClock",
  "History",
  "RefreshCw",
  "RotateCw",
  "RotateCcw",
  // Miscellaneous
  "Sparkles",
  "Wand2",
  "Magic",
  "Rocket",
  "Gem",
  "Crown",
  "Trophy",
  "Medal",
  "Badge",
  "Sticker",
  "Smile",
  "Heart",
  "Star",
  "Moon",
  "Sun",
  "Cloud",
  "Droplet",
  "Flame",
  "Snowflake",
  "Leaf",
  "TreePine",
  "Flower",
  "Bug",
  "Cat",
  "Dog",
  "Fish",
] as const

// Get all available icons by filtering the predefined list
// to only include icons that actually exist in the imported module
// Note: React components don't have a .name property, so we store the icon name
// separately in our data structure for reference and selection
const getAllIconNames = (): Array<{ name: string; component: LucideIcon }> => {
  const icons: Array<{ name: string; component: LucideIcon }> = []

  for (const name of COMMON_ICON_NAMES) {
    // Access icon from the icons namespace
    // Icons are exported with PascalCase names (e.g., "Home", "User", etc.)
    // The /icons subpath exports all icons as named exports
    const IconComponent = (lucideIcons as Record<string, unknown>)[name] as
      | LucideIcon
      | undefined

    // Verify it's a valid React component
    // Note: IconComponent itself doesn't have a .name property,
    // so we store the name separately for use in selection and callbacks
    if (IconComponent && typeof IconComponent === "function") {
      icons.push({
        name: name as string, // Store the icon name for reference
        component: IconComponent, // Store the component for rendering
      })
    }
  }

  return icons
}

// Icon data type
type IconData = {
  name: string
  component: LucideIcon
}

export const IconSelectionSheet = ({
  id,
  onIconSelected,
}: IconSelectionSheetProps) => {
  const sheet = useBottomSheet(id)
  const { theme } = useUnistyles()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

  // Get all icons and filter based on search
  const availableIcons = useMemo(() => {
    const allIcons = getAllIconNames()

    if (!searchQuery.trim()) {
      return allIcons
    }

    const query = searchQuery.toLowerCase().trim()
    return allIcons.filter((icon) => icon.name.toLowerCase().includes(query))
  }, [searchQuery])

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName)
  }

  const handleDone = () => {
    if (selectedIcon) {
      Alert.alert("Icon Selected", `Selected icon: ${selectedIcon}`)
      onIconSelected?.(selectedIcon)
      sheet.dismiss()
      // Reset state after a delay to allow dismiss animation
      setTimeout(() => {
        setSelectedIcon(null)
        setSearchQuery("")
      }, 300)
    } else {
      Alert.alert("No Icon Selected", "Please select an icon first.")
    }
  }

  const renderIconItem = ({ item }: { item: IconData }) => {
    const isSelected = selectedIcon === item.name
    const IconComponent = item.component

    return (
      <Pressable
        key={item.name}
        style={[styles.iconItem, isSelected && styles.iconItemSelected]}
        onPress={() => handleIconSelect(item.name)}
      >
        <IconComponent
          size={24}
          color={isSelected ? theme.colors.primary : theme.colors.onSurface}
          strokeWidth={isSelected ? 2.5 : 2}
        />
      </Pressable>
    )
  }

  return (
    <BottomSheetModalComponent
      id={id}
      snapPoints={["70%"]}
      backdropOpacity={0.5}
      backdropPressBehavior="close"
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <View style={styles.container}>
        {/* Title */}
        <Text variant="h2" style={styles.title}>
          Icon
        </Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Icon name="Tag" size={20} color={theme.colors.onSecondary} />
          <BottomSheetTextInput
            style={styles.searchInput}
            placeholder="Search icons..."
            placeholderTextColor={theme.colors.onSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Icon Grid - Using BottomSheetScrollView for proper scrolling */}
        {availableIcons.length > 0 ? (
          <BottomSheetScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.iconGridWrapper}>
              {availableIcons.map((item) => renderIconItem({ item }))}
            </View>
          </BottomSheetScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text variant="p" style={styles.emptyStateText}>
              No icons found
            </Text>
          </View>
        )}

        {/* Footer with Done button - Fixed at bottom */}
        <View style={styles.footer}>
          <Pressable onPress={handleDone} style={styles.doneButton}>
            <Icon name="Check" size={20} color={theme.colors.primary} />
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </BottomSheetModalComponent>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: theme.colors.onSurface,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.colors.radius,
    borderWidth: 1,
    borderColor: theme.colors.onSurface,
    backgroundColor: theme.colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    padding: 0,
  },
  iconGridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: theme.colors.onSecondary,
  },
  iconItem: {
    width: "16.66%", // 6 columns (100% / 6)
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: theme.colors.radius,
  },
  iconItemSelected: {
    backgroundColor: theme.colors.secondary,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: theme.colors.onSurface + "20",
    backgroundColor: theme.colors.surface,
  },
  doneButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
}))
