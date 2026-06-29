import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalState {
  // Active Contexts
  activePatientId: string | null;
  activeFacilityId: string | null;
  activeSessionId: string | null;
  
  // Search & Filter
  searchQuery: string;
  
  // Actions
  setActivePatientId: (id: string | null) => void;
  setActiveFacilityId: (id: string | null) => void;
  setActiveSessionId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetContext: () => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      activePatientId: null,
      activeFacilityId: null,
      activeSessionId: null,
      searchQuery: "",
      
      setActivePatientId: (id) => set({ activePatientId: id }),
      setActiveFacilityId: (id) => set({ activeFacilityId: id }),
      setActiveSessionId: (id) => set({ activeSessionId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      resetContext: () => set({
        activePatientId: null,
        activeFacilityId: null,
        activeSessionId: null,
        searchQuery: "",
      }),
    }),
    {
      name: "mediai-global-storage", // local storage key
    }
  )
);
