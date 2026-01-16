import { create } from 'zustand';

interface UIStore {
  // Search modal state
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  
  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Search modal
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  
  // Search query
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  
  // Loading
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));
