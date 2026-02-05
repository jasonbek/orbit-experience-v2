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
  currentMilestoneIndex: number;
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

      currentMilestoneIndex: 0,
      unlockedIndex: 0, // 0-based index of the furthest unlocked milestone
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
          const { unlockedIndex, currentMilestoneIndex, completedMilestoneIds } = get();

          if (!completedMilestoneIds.includes(milestoneId)) {
            set({
              completedMilestoneIds: [...completedMilestoneIds, milestoneId],
              unlockedIndex: Math.max(unlockedIndex, currentMilestoneIndex + 1),
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
        const { completedMilestoneIds, unlockedIndex, currentMilestoneIndex } = get();
        if (!completedMilestoneIds.includes(id)) {
          set({
            completedMilestoneIds: [...completedMilestoneIds, id],
            unlockedIndex: Math.max(unlockedIndex, currentMilestoneIndex + 1),
          });
        }
      },

      nextMilestone: () => {
        const { currentMilestoneIndex, unlockedIndex } = get();
        if (currentMilestoneIndex < milestones.length - 1 && currentMilestoneIndex < unlockedIndex) {
          set({ currentMilestoneIndex: currentMilestoneIndex + 1 });
        }
      },

      resetMission: () => set({
        role: null,
        currentMilestoneIndex: 0,
        unlockedIndex: 0,
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
