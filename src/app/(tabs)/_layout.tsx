import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import * as Haptics from "expo-haptics"
import { useRef, useState } from "react"
import PagerView, {
  type PagerViewOnPageSelectedEvent,
} from "react-native-pager-view"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { StyleSheet, useUnistyles } from "react-native-unistyles"

import { Button } from "~/components/ui/button"
import { IconSymbol, type IconSymbolName } from "~/components/ui/icon-symbol"
import { View } from "~/components/ui/view"

import HomeScreen from "."
import ExploreScreen from "./explore"

type TabConfig = {
  key: string
  icon: IconSymbolName
  component: React.ComponentType
}

const tabs: TabConfig[] = [
  { key: "home", icon: "house.fill", component: HomeScreen },
  { key: "explore", icon: "paperplane.fill", component: ExploreScreen },
]

export default function TabLayout() {
  const pagerRef = useRef<PagerView>(null)
  const [activePage, setActivePage] = useState(0)
  const { theme } = useUnistyles()
  const insets = useSafeAreaInsets()

  const styles = StyleSheet.create((t) => ({
    container: {
      flex: 1,
      backgroundColor: t.background,
    },
    pager: {
      flex: 1,
    },
    page: {
      flex: 1,
    },

    // ⛔ NEVER paints, NEVER blocks touches
    tabBarContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      backgroundColor: "transparent",
      pointerEvents: "box-none",
    },

    // ✅ Only real hitbox
    tabBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      height: 54,
      width: "90%",
      maxWidth: 420,
      borderRadius: 10,
      backgroundColor: t.card,
      marginBottom: insets.bottom + 8,

      pointerEvents: "auto",
    },

    tabButton: {
      flex: 1,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    centerButton: {
      // position: "absolute",
      // left: "50%",
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: t.primary,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 20,
    },
  }))

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setActivePage(e.nativeEvent.position)
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const goTo = (index: number) => {
    pagerRef.current?.setPage(index)
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {tabs.map((tab) => (
          <View key={tab.key} style={styles.page}>
            <tab.component />
          </View>
        ))}
      </PagerView>

      {/* Floating tab bar */}
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          <Button
            variant="link"
            size="icon"
            onPress={() => goTo(0)}
            style={styles.tabButton}
          >
            <IconSymbol
              size={24}
              name="house.fill"
              color={activePage === 0 ? theme.primary : theme.mutedForeground}
            />
          </Button>

          <Button
            variant="default"
            size="icon"
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            }
          >
            <MaterialIcons
              name="add"
              size={28}
              color={theme.primaryForeground}
            />
          </Button>

          <Button
            variant="link"
            size="icon"
            onPress={() => goTo(1)}
            style={styles.tabButton}
          >
            <IconSymbol
              size={24}
              name="paperplane.fill"
              color={activePage === 1 ? theme.primary : theme.mutedForeground}
            />
          </Button>
        </View>
      </View>
    </View>
  )
}
