import { create } from 'zustand';

interface UserState {
  hasCompletedOnboarding: boolean;
  goal: 'weight loss' | 'muscle gain' | 'general fitness' | null;
  experience: 'beginner' | 'intermediate' | 'advanced' | null;
  equipment: ('none' | 'dumbbells' | 'resistance bands' | 'full gym')[];
  streak: number;
  completeOnboarding: (data: Partial<UserState>) => void;
  incrementStreak: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  hasCompletedOnboarding: false,
  goal: null,
  experience: null,
  equipment: [],
  streak: 0,
  completeOnboarding: (data) => set({ ...data, hasCompletedOnboarding: true }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
}));

import { Exercise } from '../core/constants/mockData';

export interface WorkoutSession {
  id: string;
  exercises: Exercise[];
  completedCount: number;
  duration: number;
}

interface WorkoutState {
  currentSession: WorkoutSession | null;
  history: WorkoutSession[];
  startWorkout: (session: WorkoutSession) => void;
  endWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  currentSession: null,
  history: [],
  startWorkout: (session) => set({ currentSession: session }),
  endWorkout: () => set((state) => ({
    history: state.currentSession ? [state.currentSession, ...state.history] : state.history,
    currentSession: null
  })),
}));
