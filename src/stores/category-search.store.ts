import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface CategorySearchStore {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

export const useCategorySearchStore = create<CategorySearchStore>()(
  devtools(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query: string) => {
        set({ searchQuery: query }, false, "setSearchQuery")
      },
      clearSearch: () => {
        set({ searchQuery: "" }, false, "clearSearch")
      },
    }),
    { name: "category-search-store" },
  ),
)
