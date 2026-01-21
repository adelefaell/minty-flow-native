import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { FlatList } from "react-native"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Icon } from "~/components/icon"
import { Button } from "~/components/ui/button"
import { Pressable } from "~/components/ui/pressable"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"
import {
  ExpensePresets,
  IncomePresets,
  TransferPresets,
} from "~/constants/pre-sets-categories"
import type { Category, CategoryType } from "~/types/categories"

export default function CategoryPresetsScreen() {
  const router = useRouter()
  const { theme } = useUnistyles()
  const params = useLocalSearchParams<{
    type: CategoryType
  }>()

  const type = (params.type as CategoryType) || "expense"
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set())
  const [addedPresets, setAddedPresets] = useState<Set<string>>(new Set()) // Track already added presets

  // Helper function to get color value from color name - using system colors
  const getColorValue = (colorName: string): string => {
    // Map preset color names to theme system colors
    const colorMap: Record<string, string> = {
      emerald: theme.colors.customColors?.success || "#22c55e",
      blue: theme.colors.customColors?.info || "#3b82f6",
      red: theme.colors.error || "#ef4444",
      purple: theme.colors.primary || "#a855f7",
      pink: "#ec4899",
      green: theme.colors.customColors?.success || "#22c55e",
      amber: theme.colors.customColors?.warning || "#f59e0b",
      teal: "#14b8a6",
      indigo: "#6366f1",
      rose: "#f43f5e",
      orange: theme.colors.customColors?.warning || "#f97316",
    }
    return colorMap[colorName] || theme.colors.secondary || "#6b7280"
  }

  // Get presets based on type - each tab shows only its own presets
  const presets = (() => {
    switch (type) {
      case "expense":
        return ExpensePresets
      case "income":
        return IncomePresets
      case "transfer":
        return TransferPresets
      default:
        return []
    }
  })()

  const togglePreset = (presetId: string) => {
    setSelectedPresets((prev) => {
      const next = new Set(prev)
      if (next.has(presetId)) {
        next.delete(presetId)
      } else {
        next.add(presetId)
      }
      return next
    })
  }

  const handleAddSelected = () => {
    const selected = presets.filter((preset) =>
      selectedPresets.has(preset.id),
    ) as Category[]

    // TODO: Save to database
    // Mark selected presets as added
    setAddedPresets((prev) => {
      const selectedIds = selected.map((preset) => preset.id)
      return new Set([...prev, ...selectedIds])
    })

    // Clear selection
    setSelectedPresets(new Set())

    // For now, navigate back with the selected presets
    if (selected.length > 0) {
      router.back()
      // You can pass the selected presets via params or use a state management solution
      // router.setParams({ selectedPresets: JSON.stringify(selected) })
    }
  }

  const renderPresetItem = ({ item }: { item: (typeof presets)[0] }) => {
    const isSelected = selectedPresets.has(item.id)
    const isAdded = addedPresets.has(item.id)

    return (
      <Pressable
        style={styles.presetItem}
        onPress={() => {
          if (!isAdded) {
            togglePreset(item.id)
          }
        }}
        disabled={isAdded}
      >
        {/* Icon container - dark rounded square with colored icon/color */}
        <View style={styles.iconContainer}>
          {item.color ? (
            <View
              style={[
                styles.colorIcon,
                {
                  backgroundColor: getColorValue(item.color.name),
                },
              ]}
            />
          ) : (
            <View style={[styles.colorIcon, { backgroundColor: "#6b7280" }]} />
          )}
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text variant="default" style={styles.presetName}>
            {item.name}
          </Text>
          <Text variant="small" style={styles.presetSubtitle}>
            Preset category
          </Text>
        </View>

        {/* Right side action */}
        {isAdded ? (
          <View style={styles.addedBadge}>
            <Text variant="small" style={styles.addedText}>
              Added
            </Text>
          </View>
        ) : isSelected ? (
          <View style={styles.checkmark}>
            <Icon name="Check" size={16} color="#ffffff" />
          </View>
        ) : (
          <View style={styles.plusButton}>
            <Icon name="Plus" size={20} color="#ffffff" />
          </View>
        )}
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h2" style={styles.title}>
          Preset categories
        </Text>
      </View>

      <FlatList
        data={presets}
        keyExtractor={(item) => item.id}
        renderItem={renderPresetItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.buttonContainer}>
        <Button
          variant="default"
          onPress={handleAddSelected}
          disabled={selectedPresets.size === 0}
          style={styles.addButton}
        >
          <Text variant="default" style={styles.addButtonText}>
            Add {selectedPresets.size} Selected
          </Text>
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 0,
  },
  presetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 0,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
    borderBottomOpacity: 0.1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  colorIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  presetName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  presetSubtitle: {
    fontSize: 13,
    color: theme.colors.onSecondary,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  addedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
  },
  addedText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onPrimary || "#ffffff",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: theme.colors.surface,
  },
  addButton: {
    width: "100%",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onPrimary || "#ffffff",
  },
}))
