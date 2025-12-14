import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface ReorderModeStore {
  reorderMode: boolean
  setReorderMode: (value: boolean) => void
  toggleReorderMode: () => void
}

export const useReorderModeStore = create<ReorderModeStore>()(
  devtools(
    (set) => ({
      reorderMode: false,
      setReorderMode: (value: boolean) => {
        set({ reorderMode: value })
      },
      toggleReorderMode: () => {
        set((state) => ({ reorderMode: !state.reorderMode }))
      },
    }),
    { name: "reorder-mode-store-dev" },
  ),
)
