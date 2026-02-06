import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { milestones, type Milestone } from '@/data/milestones';

interface OrbitState {
  // Hydration Guard
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Mission State
  role: 'mission-control' | 'commander' | null;
  setUserRole: (role: 'mission-control' | 'commander') => void;

  // Milestone Progress
  currentStep: number; // 0 (Role Select) -> 1-10 (Challenges) -> 11 (Report)
  unlockedIndex: number;
  completedMilestoneIds: string[];

  // Feedback States
  isShaking: boolean;
  correctPulse: boolean;

  // Actions
  checkAnswer: (milestoneId: string, selectedOption: string) => boolean;
  completeMilestone: (id: string) => void;
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

      isShaking: false,
      correctPulse: false,

      checkAnswer: (milestoneId, selectedOption) => {
        const milestone = milestones.find((m) => m.id === milestoneId);
        if (!milestone) return false;

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
              unlockedIndex: Math.max(unlockedIndex, currentIdx + 2),
            });
          }
          return true;
        } else {
          // Failure Path
          set({ isShaking: true });

          // Trigger physics-based feedback for 500ms
          setTimeout(() => set({ isShaking: false }), 500);
          return false;
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

      nextStep: () => {
        const { currentStep, unlockedIndex } = get();
        // Allow advancing if currentStep < unlockedIndex OR we are in Role Selection (0)
        if (currentStep === 0 || (currentStep < milestones.length && currentStep < unlockedIndex)) {
          set({ currentStep: currentStep + 1 });
        }
      },

      resetMission: () => set({
        role: null,
        currentStep: 0,
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
