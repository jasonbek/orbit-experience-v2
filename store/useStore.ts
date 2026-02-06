import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { milestones, type Milestone } from '@/data/milestones';

interface OrbitState {
  // Hydration Guard
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Mission State
  role: 'Mission Control' | 'Commander' | null;
  setRole: (role: 'Mission Control' | 'Commander') => void;

  // Milestone Progress
  currentStep: number; // 1 to 11 (11 = complete)
  unlockedIndex: number;
  completedMilestoneIds: string[];

  // Feedback States
  isShaking: boolean;
  correctPulse: boolean;

  // Actions
  checkAnswer: (milestoneId: string, selectedOption: string) => void;
  completeMilestone: (id: string) => void;
  nextMilestone: () => void;
  resetMission: () => void;
}

export const useStore = create<OrbitState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      role: null,
      setRole: (role) => set({ role }),

      currentStep: 1,
      unlockedIndex: 1, // 1-based index
      completedMilestoneIds: [],

      isShaking: false,
      correctPulse: false,

      checkAnswer: (milestoneId, selectedOption) => {
        const milestone = milestones.find((m) => m.id === milestoneId);
        if (!milestone) return;

        if (selectedOption === milestone.correctAnswer) {
          // Success Path
          set({ correctPulse: true });

          // Clear pulse after animation duration
          setTimeout(() => set({ correctPulse: false }), 2000);

          // Update progress
          const { unlockedIndex, completedMilestoneIds } = get();
          const currentIdx = milestones.findIndex(m => m.id === milestoneId);

          if (!completedMilestoneIds.includes(milestoneId)) {
            set({
              completedMilestoneIds: [...completedMilestoneIds, milestoneId],
              unlockedIndex: Math.max(unlockedIndex, currentIdx + 2), // Unlock NEXT step
            });
          }
        } else {
          // Failure Path
          set({ isShaking: true });

          // Trigger physics-based feedback for 500ms
          setTimeout(() => set({ isShaking: false }), 500);
        }
      },

      completeMilestone: (id) => {
        const { completedMilestoneIds, unlockedIndex } = get();
        const currentIdx = milestones.findIndex(m => m.id === id);
        if (!completedMilestoneIds.includes(id)) {
          set({
            completedMilestoneIds: [...completedMilestoneIds, id],
            unlockedIndex: Math.max(unlockedIndex, currentIdx + 2),
          });
        }
      },

      nextMilestone: () => {
        const { currentStep, unlockedIndex } = get();
        if (currentStep <= milestones.length && currentStep < unlockedIndex) {
          set({ currentStep: currentStep + 1 });
        }
      },

      resetMission: () => set({
        role: null,
        currentStep: 1,
        unlockedIndex: 1,
        completedMilestoneIds: [],
        isShaking: false,
        correctPulse: false,
      }),
    }),
    {
      name: 'orbit-mission-v2.1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
