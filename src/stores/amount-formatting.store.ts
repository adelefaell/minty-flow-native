import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

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
      },
    ),
    { name: "amount-formatting-store-dev" },
  ),
)
