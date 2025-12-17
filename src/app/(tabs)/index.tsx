import { Link } from "expo-router"
import { Platform, ScrollView, StatusBar } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"

import { HelloWave } from "~/components/hello-wave"
import { ThemedView } from "~/components/themed-view"
import { Button } from "~/components/ui/button"
import { Text } from "~/components/ui/text"

export default function HomeScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        className={"flex-1"}
        edges={["top"]}
        style={{ paddingTop: StatusBar.currentHeight }}
      >
        <ScrollView>
          <ThemedView className="py-10 px-4">
            <Text>Welcome Fuck!</Text>
            <HelloWave />
          </ThemedView>
          <ThemedView>
            <Text>Step 1: Try it</Text>
            <Text>
              Edit <Text>src/app/(tabs)/index.tsx</Text> to see changes. Press{" "}
              <Text>
                {Platform.select({
                  ios: "cmd + d",
                  android: "cmd + m",
                  web: "F12",
                })}
              </Text>{" "}
              to open developer tools.
            </Text>
          </ThemedView>
          <ThemedView>
            <Link href="/modal">
              <Link.Trigger>
                <Text>Step 2: Explore</Text>
              </Link.Trigger>
              <Link.Preview />
              <Link.Menu>
                <Link.MenuAction
                  title="Action"
                  icon="cube"
                  onPress={() => alert("Action pressed")}
                />
                <Link.MenuAction
                  title="Share"
                  icon="square.and.arrow.up"
                  onPress={() => alert("Share pressed")}
                />
                <Link.Menu title="More" icon="ellipsis">
                  <Link.MenuAction
                    title="Delete"
                    icon="trash"
                    destructive
                    onPress={() => alert("Delete pressed")}
                  />
                </Link.Menu>
              </Link.Menu>
            </Link>

            <Text>
              {`Tap the Explore tab to learn more about what's included in this starter app.`}
            </Text>
          </ThemedView>
          <ThemedView>
            <Text>Step 3: Get a fresh start</Text>
            <Text>
              {`When you're ready, run `}
              <Text>npm run reset-project</Text> to get a fresh <Text>app</Text>{" "}
              directory. This will move the current <Text>app</Text> to{" "}
              <Text>app-example</Text>.
            </Text>
          </ThemedView>
          <ThemedView className="gap-2 py-4 items-center">
            <Text>Step 4: Test the button</Text>

            <ThemedView className="flex-row gap-2 flex-wrap justify-center">
              <Button variant="default">
                <Text>Default</Text>
              </Button>
              <Button variant="destructive">
                <Text>Destructive</Text>
              </Button>
              <Button variant="outline">
                <Text>Outline</Text>
              </Button>
              <Button variant="secondary">
                <Text className="">Secondary</Text>
              </Button>
              <Button variant="ghost">
                <Text>Ghost</Text>
              </Button>
              <Button variant="link">
                <Text>Link</Text>
              </Button>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: "absolute",
//   },
// })
