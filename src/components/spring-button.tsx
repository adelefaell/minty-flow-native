import type { ComponentProps } from "react"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

import { Pressable } from "~/components/ui/pressable"

// Animated Pressable with subtle scale animation
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export const SpringButton = ({
  children,
  onPress,
  style,
  ...props
}: ComponentProps<typeof Pressable>) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    })
  }

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {children}
    </AnimatedPressable>
  )
}
