import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface LetterEmojiStore {
  recent: string[]
  addRecent: (value: string) => void
  clearRecent: () => void
}

const MAX_RECENT_ITEMS = 6

// TODO: Add storage to persist the recent letter emojis

export const useLetterEmojiStore = create<LetterEmojiStore>()(
  devtools(
    persist(
      (set) => ({
        recent: [],

        addRecent: (value: string) => {
          if (!value) return

          set(
            (state) => {
              const filtered = state.recent.filter((item) => item !== value)
              const next = [value, ...filtered].slice(0, MAX_RECENT_ITEMS)
              return { ...state, recent: next }
            },
            false,
            "addRecent",
          )
        },

        clearRecent: () => {
          set((state) => ({ ...state, recent: [] }), false, "clearRecent")
        },
      }),
      {
        name: "recent-letter-emoji-store",
        version: 1,
      },
    ),
    { name: "letter-emoji-store-dev" },
  ),
)
