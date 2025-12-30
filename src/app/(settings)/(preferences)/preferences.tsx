import { type Href, useRouter } from "expo-router"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import type { IconSymbolName } from "~/components/ui/icon-symbol"
import { View } from "~/components/ui/view"

interface PreferenceItem {
  id: string
  title: string
  description?: string
  route: Href
  icon: IconSymbolName
}

const preferenceItems: PreferenceItem[] = [
  {
    id: "theme",
    title: "Theme",
    description: "Choose your preferred theme",
    route: "/(settings)/(preferences)/theme",
    icon: "paintbrush.fill",
  },
  {
    id: "toast",
    title: "Toast Appearance",
    description: "Configure your preferred toast appearance",
    route: "/(settings)/(preferences)/toast-appearance",
    icon: "bell.fill",
  },
]

export default function PreferencesScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View native style={styles.itemsList}>
        {preferenceItems.map((item, index) => (
          <ActionItem
            index={index}
            key={item.id}
            icon={item.icon}
            title={item.title}
            // description={item.description}
            onPress={() => router.push(item.route)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    paddingBottom: 40,
  },
  itemsList: {
    gap: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
    _web: {
      cursor: "pointer",
      transitionProperty: "all",
      transitionDuration: "150ms",
      _hover: {
        backgroundColor: theme.colors.secondary,
      },
    },
  },
  itemPressed: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.8,
  },
  itemIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: theme.colors.onSurface,
  },
  itemDescription: {
    fontSize: 13,
    color: theme.colors.onSecondary,
    lineHeight: 18,
  },
  itemChevron: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
}))
