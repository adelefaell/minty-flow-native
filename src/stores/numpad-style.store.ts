import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type NumpadStyle = "classic" | "modern"

interface NumpadStyleStore {
  numpadStyle: NumpadStyle
  setNumpadStyle: (value: NumpadStyle) => void
}

export const useNumpadStyleStore = create<NumpadStyleStore>()(
  devtools(
    persist(
      (set) => ({
        numpadStyle: "classic",
        setNumpadStyle: (value: NumpadStyle) => {
          set({ numpadStyle: value })
        },
      }),
      {
        name: "numpad-style-store",
      },
    ),
    { name: "numpad-style-store-dev" },
  ),
)
