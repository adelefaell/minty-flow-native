import { useCallback } from "react"
import { Pressable, StyleSheet } from "react-native"

import {
  BottomSheetModalComponent,
  useBottomSheet,
} from "~/components/bottom-sheet"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

/** // TODO: To be deleted later
 * Example Bottom Sheet 2: Action Menu Sheet
 * Demonstrates a menu with multiple action options
 */
export function ExampleBottomSheet2() {
  const sheet = useBottomSheet("action-menu-sheet")

  const handleAction = useCallback(
    (action: string) => {
      // Handle action: share, download, favorite, settings, delete
      alert(`Action selected: ${action}`)
      sheet.dismiss()
    },
    [sheet],
  )

  return (
    <>
      <Pressable style={styles.triggerButton} onPress={() => sheet.present()}>
        <Text style={styles.triggerButtonText}>Open Action Menu</Text>
      </Pressable>

      <BottomSheetModalComponent
        id="action-menu-sheet"
        // snapPoints={["50%", "75%"]}
        backdropOpacity={0.5}
        onChange={(sheetIndex) => {
          if (sheetIndex === -1) {
            // Sheet closed
          }
        }}
        onDismiss={() => {
          // Handle sheet dismiss
        }}
      >
        <View style={styles.container}>
          <Text variant="h2" style={styles.title}>
            Choose an Action
          </Text>
          <Text variant="p" style={styles.description}>
            Select an option from the menu below
          </Text>

          <View style={styles.menuContainer}>
            <Pressable
              style={styles.menuItem}
              onPress={() => handleAction("share")}
            >
              <Text style={styles.menuIcon}>📤</Text>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Share</Text>
                <Text style={styles.menuItemSubtitle}>
                  Share this content with others
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleAction("download")}
            >
              <Text style={styles.menuIcon}>⬇️</Text>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Download</Text>
                <Text style={styles.menuItemSubtitle}>Save to your device</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleAction("favorite")}
            >
              <Text style={styles.menuIcon}>⭐</Text>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Add to Favorites</Text>
                <Text style={styles.menuItemSubtitle}>
                  Save for later viewing
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>

            <Pressable
              style={styles.menuItem}
              onPress={() => handleAction("settings")}
            >
              <Text style={styles.menuIcon}>⚙️</Text>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>Settings</Text>
                <Text style={styles.menuItemSubtitle}>
                  Configure preferences
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, styles.dangerItem]}
              onPress={() => handleAction("delete")}
            >
              <Text style={styles.menuIcon}>🗑️</Text>
              <View style={styles.menuItemContent}>
                <Text style={[styles.menuItemTitle, styles.dangerText]}>
                  Delete
                </Text>
                <Text style={styles.menuItemSubtitle}>Remove permanently</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.cancelButton}
            onPress={() => sheet.dismiss()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </BottomSheetModalComponent>
    </>
  )
}

const styles = StyleSheet.create({
  triggerButton: {
    backgroundColor: "#9B59B6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
    marginVertical: 8,
  },
  triggerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    marginBottom: 8,
  },
  dangerItem: {
    backgroundColor: "#FFF5F5",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  menuArrow: {
    fontSize: 24,
    color: "#999",
  },
  dangerText: {
    color: "#E74C3C",
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
})
