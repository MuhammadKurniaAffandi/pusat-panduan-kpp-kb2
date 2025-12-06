import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      sidebarCollapsed: false,

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleCollapse: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      closeSidebar: () => set({ sidebarOpen: false }),
    }),
    {
      name: "ui-storage",
    }
  )
);
