import { View, type ViewProps } from "react-native"

import { cn } from "~/utils/cn"

export type ThemedViewProps = ViewProps

export function ThemedView({ className, ...otherProps }: ThemedViewProps) {
  return <View className={cn("bg-background", className)} {...otherProps} />
}
