import { createMMKV } from "react-native-mmkv"
import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

/**
 * MMKV storage instance for amount formatting preferences.
 *
 * This instance is optimized for storing formatting settings with high performance.
 * MMKV is ~30x faster than AsyncStorage and provides synchronous operations.
 *
 * @see https://github.com/mrousavy/react-native-mmkv
 */
export const amountFormattingStorage = createMMKV({
  id: "amount-formatting-storage",
})

export type MoneyFormat = "symbol" | "code" | "name"

interface AmountFormattingStore {
  privacyMode: boolean

  currencyLook: MoneyFormat
  setPrivacyMode: (value: boolean) => void
  togglePrivacyMode: () => void

  setCurrencyLook: (value: MoneyFormat) => void
}

export const useAmountFormattingStore = create<AmountFormattingStore>()(
  devtools(
    persist(
      (set) => ({
        currencyLook: "symbol",
        privacyMode: false,

        setPrivacyMode: (value: boolean) => {
          set({ privacyMode: value })
        },

        togglePrivacyMode: () => {
          set((state) => ({ privacyMode: !state.privacyMode }))
        },

        setCurrencyLook: (value: MoneyFormat) => {
          set({ currencyLook: value })
        },
      }),
      {
        name: "amount-formatting-store",
        // Use the custom MMKV instance for storage
        storage: createJSONStorage(() => ({
          getItem: (name) => amountFormattingStorage.getString(name) ?? null,
          setItem: (name, value) => amountFormattingStorage.set(name, value),
          removeItem: (name) => amountFormattingStorage.remove(name),
        })),
      },
    ),
    { name: "amount-formatting-store-dev" },
  ),
)
