import type { FC } from "react"
import { Text as RNText } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import {
  type IconSize,
  IconSymbol,
  type IconSymbolName,
  VALID_ICON_NAMES,
} from "~/components/ui/icon-symbol"
import { View } from "~/components/ui/view"
import { isSingleEmojiOrLetter } from "~/utils/is-single-emoji-or-letter"

interface ColorOption {
  textClass?: string
}

interface DynamicIconProps {
  icon?: string | null
  size?: IconSize
  color?: string
  colorOption?: ColorOption | null
}

/**
 * Type guard to check if a string is a valid IconSymbolName
 */
function isValidIconName(icon: string): icon is IconSymbolName {
  return VALID_ICON_NAMES.includes(icon as IconSymbolName)
}

export const DynamicIcon: FC<DynamicIconProps> = ({
  icon,
  size = 24,
  color,
  colorOption,
}) => {
  // Check if icon is a single emoji or letter
  if (icon && icon !== null && isSingleEmojiOrLetter(icon)) {
    return (
      <View style={styles.emojiContainer}>
        <RNText
          style={[
            styles.emojiText,
            { fontSize: size, lineHeight: size * 1.2 },
            color && { color },
            colorOption?.textClass && { color: colorOption.textClass },
          ]}
        >
          {icon}
        </RNText>
      </View>
    )
  }

  // Check if icon is a valid IconSymbolName from the icon registry
  if (icon && icon !== null && isValidIconName(icon)) {
    return (
      <IconSymbol
        name={icon}
        size={size}
        color={color || colorOption?.textClass}
      />
    )
  }

  // Fallback to default icon
  return (
    <IconSymbol
      name="circle-outline"
      size={size}
      color={color || colorOption?.textClass}
    />
  )
}

const styles = StyleSheet.create(() => ({
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emojiText: {
    fontWeight: "600",
    // Don't set lineHeight - let React Native compute it automatically
    // Setting lineHeight to 1 causes emojis to be clipped and show as ❓
    textAlign: "center",
    // Don't set fontFamily - let the system use native emoji fonts
    // This ensures emojis render correctly on iOS (Apple Color Emoji) and Android (Noto Color Emoji)
  },
}))
