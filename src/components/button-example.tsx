import { View } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import { Button } from "./ui/button"
import { Text } from "./ui/text"

/**
 * Example usage of the Button component with Unistyles
 */
export function ButtonExample() {
  return (
    <View style={styles.container}>
      {/* Default Button */}
      <Button onPress={() => {}}>
        <Text>Default Button</Text>
      </Button>

      {/* Destructive Button */}
      <Button variant="destructive" onPress={() => {}}>
        <Text>Delete</Text>
      </Button>

      {/* Outline Button */}
      <Button variant="outline" onPress={() => {}}>
        <Text>Outline</Text>
      </Button>

      {/* Secondary Button */}
      <Button variant="secondary" onPress={() => {}}>
        <Text>Secondary</Text>
      </Button>

      {/* Ghost Button */}
      <Button variant="ghost" onPress={() => {}}>
        <Text>Ghost</Text>
      </Button>

      {/* Link Button */}
      <Button variant="link" onPress={() => {}}>
        <Text>Link Button</Text>
      </Button>

      {/* Small Button */}
      <Button size="sm" onPress={() => {}}>
        <Text>Small</Text>
      </Button>

      {/* Large Button */}
      <Button size="lg" onPress={() => {}}>
        <Text>Large</Text>
      </Button>

      {/* Icon Button */}
      <Button size="icon" onPress={() => {}}>
        <Text>+</Text>
      </Button>

      {/* Disabled Button */}
      <Button disabled onPress={() => {}}>
        <Text>Disabled</Text>
      </Button>

      {/* Combined variants */}
      <Button variant="destructive" size="sm" onPress={() => {}}>
        <Text>Delete (Small)</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create(() => ({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    paddingBottom: 200,
  },
}))
