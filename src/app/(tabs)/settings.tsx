import { type Href, useRouter } from "expo-router"
import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { ActionItem } from "~/components/action-item"
import { ProfileSection } from "~/components/profile-section"
import type { IconSymbolName } from "~/components/ui/icon-symbol"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface SettingsItem {
  id: string
  title: string
  description?: string
  route: Href
  icon: IconSymbolName
}

const moneyManagementItems: SettingsItem[] = [
  {
    id: "loans",
    title: "Loans",
    description: "Track money lent and borrowed",
    route: "/(settings)/loans",
    icon: "dollarsign.circle",
  },
  {
    id: "categories",
    title: "Categories",
    description: "Manage your transaction categories",
    route: "/(settings)/categories",
    icon: "square.grid.2x2",
  },
  {
    id: "tags",
    title: "Tags",
    description: "Manage your transaction tags",
    route: "/(settings)/tags",
    icon: "tag",
  },
  {
    id: "trash",
    title: "Trash",
    description: "View and restore deleted transactions",
    route: "/(settings)/trash",
    icon: "trash",
  },
]

const otherSettingsItems: SettingsItem[] = [
  {
    id: "preferences",
    title: "Preferences",
    description: "General preferences",
    route: "/(settings)/(preferences)/preferences",
    icon: "gearshape.fill",
  },
  {
    id: "data-management",
    title: "Data Management",
    description: "Backup, import, and export your data",
    route: "/(settings)/data-management",
    icon: "server.rack",
  },
]

export default function SettingsScreen() {
  const router = useRouter()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text variant="h2" style={styles.headerTitle}>
          SETTINGS
        </Text>
      </View> */}

      {/* User Profile Section */}
      <ProfileSection />

      {/* Money Management Section */}
      <View style={styles.section}>
        <Text variant="small" style={styles.sectionTitle}>
          MONEY MANAGEMENT
        </Text>
        <View style={styles.sectionContent}>
          {moneyManagementItems.map((item) => (
            <ActionItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              // description={item.description}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </View>

      {/* Other Settings Section */}
      <View style={styles.section}>
        <Text variant="small" style={styles.sectionTitle}>
          OTHER SETTINGS
        </Text>
        <View style={styles.sectionContent}>
          {otherSettingsItems.map((item) => (
            <ActionItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              // description={item.description}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    marginBottom: 50,
    paddingTop: 50,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: theme.colors.onSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
    color: theme.colors.onSecondary,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionContent: {
    borderTopWidth: 1,
    borderColor: theme.colors.onSurface,
  },
}))
