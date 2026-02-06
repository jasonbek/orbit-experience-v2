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

  // Transmission HUD State (V2.2 Simulation Pivot)
  isTransmissionOpen: boolean;
  activeMilestoneId: string | null;

  // Feedback States
  isShaking: boolean;
  correctPulse: boolean;

  // Actions
  checkAnswer: (milestoneId: string, selectedOption: string) => boolean;
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

      isShaking: false,
      correctPulse: false,

      openTransmission: (id) => {
        // Only allow opening if it's the current target or already completed (explorable)
        const { currentStep } = get();
        if (id === currentStep.toString() || get().completedMilestoneIds.includes(id)) {
          set({ isTransmissionOpen: true, activeMilestoneId: id });
        }
      },

      closeTransmission: () => set({ isTransmissionOpen: false, activeMilestoneId: null }),

      checkAnswer: (milestoneId, selectedOption) => {
        const milestone = milestones.find((m) => m.id === milestoneId);
        if (!milestone) return false;

        if (selectedOption === milestone.correctAnswer) {
          // SUCCESS: Play Sound & Advance
          set({ correctPulse: true, isShaking: false });

          // Clear pulse after animation duration
          setTimeout(() => set({ correctPulse: false }), 2000);

          // Update progress (V2.2: Note that we don't auto-advance currentStep 
          // until the HUD is closed or handled by the next node click)
          // Actually, the brief says: "Correct answer; success.mp3 plays; HUD closes. Trajectory draws forward."
          const { unlockedIndex, completedMilestoneIds, currentStep } = get();
          const nextStepValue = currentStep + 1;

          set({
            completedMilestoneIds: Array.from(new Set([...completedMilestoneIds, milestoneId])),
            unlockedIndex: Math.max(unlockedIndex, nextStepValue),
            currentStep: nextStepValue,
            isTransmissionOpen: false, // Auto-close HUD on success
            activeMilestoneId: null
          });

          return true;
        } else {
          // FAILURE: Trigger Shake
          set({ isShaking: true });

          // Trigger physics-based feedback for 500ms
          setTimeout(() => set({ isShaking: false }), 500);
          return false;
        }
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
        isShaking: false,
        correctPulse: false,
      }),
    }),
    {
      name: 'orbit-mission-v2.2', // Upgraded version name
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
