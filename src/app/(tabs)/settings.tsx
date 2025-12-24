import { StyleSheet } from "react-native-unistyles"

import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="h1">Settings</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },
}))
