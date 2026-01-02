import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
} from "react-native"
import { StyleSheet } from "react-native-unistyles"

export interface PressableProps extends RNPressableProps {
  native?: boolean
}

export const Pressable = ({ native, style, ...props }: PressableProps) => {
  if (native) return <RNPressable style={style} {...props} />

  return (
    <RNPressable
      style={
        typeof style === "function"
          ? (state) => [style(state), pressableStyles.base]
          : [style, pressableStyles.base]
      }
      android_ripple={{
        color: pressableStyles.ripple.color,
        foreground: true, // <-- KEY TO MAKE IT SHOW
      }}
      {...props}
    />
  )
}

const pressableStyles = StyleSheet.create((theme) => ({
  base: {
    overflow: "hidden",
  },
  ripple: {
    color: theme.colors.rippleColor,
  },
}))
