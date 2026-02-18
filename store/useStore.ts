import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { milestones } from '@/data/milestones';

interface OrbitState {
  // Hydration Guard
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Mission State
  role: 'mission-control' | 'commander' | null;
  setUserRole: (role: 'mission-control' | 'commander') => void;

  // Milestone Progress
  currentStep: number; // 0 (Role Select) -> 1-10 (Statements) -> 11 (Report)
  unlockedIndex: number;
  completedMilestoneIds: string[];

  // Transmission HUD State
  isTransmissionOpen: boolean;
  activeMilestoneId: string | null;

  // Onboarding
  hasSeenIntro: boolean;
  setHasSeenIntro: () => void;

  // Actions
  confirmStatement: (milestoneId: string) => void;
  openTransmission: (milestoneId: string) => void;
  closeTransmission: () => void;
  nextStep: () => void;
  resetMission: () => void;
}

export const useStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      role: null,
      setUserRole: (role) => set({ role }),

      currentStep: 0,
      unlockedIndex: 1, // First milestone on trajectory is always available
      completedMilestoneIds: [],

      isTransmissionOpen: false,
      activeMilestoneId: null,

      hasSeenIntro: false,
      setHasSeenIntro: () => set({ hasSeenIntro: true }),

      openTransmission: (id) => {
        const { currentStep } = get();
        if (id === currentStep.toString() || get().completedMilestoneIds.includes(id)) {
          set({ isTransmissionOpen: true, activeMilestoneId: id });
        }
      },

      closeTransmission: () => set({ isTransmissionOpen: false, activeMilestoneId: null }),

      confirmStatement: (milestoneId) => {
        const { unlockedIndex, completedMilestoneIds, currentStep } = get();
        const nextStepValue = currentStep + 1;
        set({
          completedMilestoneIds: Array.from(new Set([...completedMilestoneIds, milestoneId])),
          unlockedIndex: Math.max(unlockedIndex, nextStepValue),
          currentStep: nextStepValue,
          isTransmissionOpen: false,
          activeMilestoneId: null,
        });
      },

      nextStep: () => {
        const { currentStep, unlockedIndex } = get();
        if (currentStep === 0 || (currentStep < milestones.length && currentStep < unlockedIndex)) {
          set({ currentStep: currentStep + 1 });
        }
      },

      resetMission: () => set({
        role: null,
        currentStep: 0,
        unlockedIndex: 1,
        completedMilestoneIds: [],
        isTransmissionOpen: false,
        activeMilestoneId: null,
        hasSeenIntro: false,
      }),
    }),
    {
      name: 'orbit-mission-v3',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
