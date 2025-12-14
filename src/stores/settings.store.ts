import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

/**
 * MMKV storage instance for app settings.
 *
 * This instance is optimized for storing application settings with high performance.
 * MMKV is ~30x faster than AsyncStorage and provides synchronous operations.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
export const settingsStorage = createMMKV({
  id: "app-settings-storage",
  // You can optionally add encryption here if settings are sensitive
  // encryptionKey: 'my-secret-key',
})

/**
 * Settings store interface defining the shape of the settings state and actions.
 */
interface SettingsStore {
  /** The user's preferred currency code (e.g., "USD", "EUR") */
  preferredCurrency: string
  /** Whether dark mode is enabled */
  isDarkMode: boolean
  /** ISO date string of the last backup, or null if no backup has been performed */
  lastBackupDate: string | null
  /**
   * Sets the preferred currency.
   * @param currency - The currency code to set (e.g., "USD", "EUR")
   */
  setCurrency: (currency: string) => void
  /** Toggles dark mode on/off */
  toggleDarkMode: () => void
}

/**
 * Zustand store hook for managing application settings.
 *
 * This store is persisted to MMKV storage, providing fast and reliable
 * persistence of user preferences across app sessions.
 *
 * @example
 * ```tsx
 * const { preferredCurrency, setCurrency, toggleDarkMode } = useSettingsStore()
 *
 * // Update currency
 * setCurrency("EUR")
 *
 * // Toggle dark mode
 * toggleDarkMode()
 * ```
 *
 * @see https://github.com/pmndrs/zustand
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // State definitions
      preferredCurrency: "USD",
      isDarkMode: false,
      lastBackupDate: null,

      // Actions
      setCurrency: (currency) => set({ preferredCurrency: currency }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "app-settings", // Name for the store (MMKV key)
      // Use the custom MMKV instance for storage
      storage: createJSONStorage(() => ({
        getItem: (name) => settingsStorage.getString(name) ?? null,
        setItem: (name, value) => settingsStorage.set(name, value),
        removeItem: (name) => settingsStorage.remove(name),
      })),
      // Optional: limit which parts of the state are persisted
      // partialize: (state) => ({ preferredCurrency: state.preferredCurrency }),
    },
  ),
)

export default useSettingsStore
