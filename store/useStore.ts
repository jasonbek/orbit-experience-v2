import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OrbitState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  // Add other state properties here
}

export const useStore = create<OrbitState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'orbit-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
