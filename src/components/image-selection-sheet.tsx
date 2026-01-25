import { ScrollView } from "react-native"
import { StyleSheet } from "react-native-unistyles"

import {
  BottomSheetModalComponent,
  useBottomSheet,
} from "~/components/bottom-sheet"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

interface ImageSelectionSheetProps {
  id: string
  onIconSelected?: (_icon: string) => void
}

export const ImageSelectionSheet = ({
  id,
  onIconSelected: _onIconSelected,
}: ImageSelectionSheetProps) => {
  const _sheet = useBottomSheet(id)

  const _handleImageSelect = (_imageUri: string) => {
    // TODO: Implement image selection
    // onIconSelected?.(imageUri)
    // sheet.dismiss()
  }

  return (
    <BottomSheetModalComponent
      id={id}
      snapPoints={["70%"]}
      backdropOpacity={0.5}
      backdropPressBehavior="close"
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text variant="h2" style={styles.title}>
            Select Image
          </Text>
          <Text variant="p" style={styles.description}>
            Image selection sheet - Coming soon
          </Text>
          {/* TODO: Implement image picker */}
        </View>
      </ScrollView>
    </BottomSheetModalComponent>
  )
}

const styles = StyleSheet.create((theme) => ({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    color: theme.colors.onSecondary,
  },
}))
