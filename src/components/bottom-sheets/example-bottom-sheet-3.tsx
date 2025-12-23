import { useCallback, useState } from "react"
import { Pressable, StyleSheet } from "react-native"

import {
  BottomSheetModalComponent,
  useBottomSheet,
} from "~/components/bottom-sheet"
import { Text } from "~/components/ui/text"
import { View } from "~/components/ui/view"

/** // TODO: To be deleted later
 * Example Bottom Sheet 3: Form Input Sheet
 * Demonstrates a bottom sheet with form inputs and interactive content
 */
export function ExampleBottomSheet3() {
  const sheet = useBottomSheet("form-sheet")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleSubmit = useCallback(() => {
    if (selectedOption) {
      // Handle form submission with selected option
      alert(`Selected option: ${selectedOption}`)
      sheet.dismiss()
    }
  }, [selectedOption, sheet])

  const options = [
    { id: "option1", label: "Option 1", description: "First choice" },
    { id: "option2", label: "Option 2", description: "Second choice" },
    { id: "option3", label: "Option 3", description: "Third choice" },
  ]

  return (
    <>
      <Pressable style={styles.triggerButton} onPress={() => sheet.present()}>
        <Text style={styles.triggerButtonText}>Open Form Sheet</Text>
      </Pressable>

      <BottomSheetModalComponent
        id="form-sheet"
        // snapPoints={["60%", "90%"]}
        backdropOpacity={0.7}
        onChange={(sheetIndex) => {
          if (sheetIndex === -1) {
            // Sheet closed
            setSelectedOption(null)
          }
        }}
        onDismiss={() => {
          setSelectedOption(null)
        }}
      >
        <View style={styles.container}>
          <Text variant="h2" style={styles.title}>
            Select an Option
          </Text>
          <Text variant="p" style={styles.description}>
            Choose one of the options below to continue
          </Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <Pressable
                key={option.id}
                style={[
                  styles.optionCard,
                  selectedOption === option.id && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedOption(option.id)}
              >
                <View style={styles.optionContent}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedOption === option.id &&
                        styles.radioButtonSelected,
                    ]}
                  >
                    {selectedOption === option.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <View style={styles.optionTextContainer}>
                    <Text
                      style={[
                        styles.optionLabel,
                        selectedOption === option.id &&
                          styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                {selectedOption === option.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <Pressable
              style={[
                styles.submitButton,
                !selectedOption && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!selectedOption}
            >
              <Text
                style={[
                  styles.submitButtonText,
                  !selectedOption && styles.submitButtonTextDisabled,
                ]}
              >
                Continue
              </Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => sheet.dismiss()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModalComponent>
    </>
  )
}

const styles = StyleSheet.create({
  triggerButton: {
    backgroundColor: "#E67E22",
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
  optionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionCardSelected: {
    backgroundColor: "#FFF5E6",
    borderColor: "#E67E22",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: "#E67E22",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E67E22",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  optionLabelSelected: {
    color: "#E67E22",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
  },
  checkmark: {
    fontSize: 24,
    color: "#E67E22",
    fontWeight: "bold",
  },
  footer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: "#E67E22",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonTextDisabled: {
    color: "#999",
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
