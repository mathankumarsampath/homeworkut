import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../core/constants/mockData';

export interface WorkoutSession {
  id: string;
  date: string;
  duration: number; // in seconds
  exercises: Exercise[]; // Keep the metadata around for UI
  completedCount?: number;
}

interface WorkoutState {
  // Ephemeral
  currentSession: WorkoutSession | null;
  
  // Persisted
  history: WorkoutSession[];
  streak: number;
  lastWorkoutDate: string | null;

  // Actions
  startWorkout: (session: WorkoutSession) => void;
  endWorkout: () => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      
      history: [],
      streak: 0,
      lastWorkoutDate: null,

      startWorkout: (session) => set({ currentSession: session }),

      endWorkout: () => {
        const { currentSession, history, lastWorkoutDate, streak } = get();
        if (!currentSession) return;

        // Strip time to normalize dates for comparison
        const today = new Date();
        // Construct localized date string like "YYYY-MM-DD"
        // Adjusting offset so users clock is accurate locally
        const offset = today.getTimezoneOffset() * 60000;
        const localDateStr = new Date(today.getTime() - offset).toISOString().split('T')[0];

        let newStreak = streak;

        if (!lastWorkoutDate) {
          // Rule: First workout => 1
          newStreak = 1;
        } else {
          const lastDate = new Date(lastWorkoutDate);
          const current = new Date(localDateStr);
          
          const diffDays = Math.round((current.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            // Last workout was yesterday
            newStreak += 1;
          } else if (diffDays > 1) {
            // Gap > 1 day
            newStreak = 1;
          }
          // If 0 (same day) do nothing
        }

        const enrichedSession: WorkoutSession = {
          ...currentSession,
          date: localDateStr
        };

        set({
          history: [enrichedSession, ...history],
          currentSession: null,
          streak: newStreak,
          lastWorkoutDate: localDateStr,
        });
      },

      resetWorkout: () => set({ 
        history: [], 
        streak: 0, 
        lastWorkoutDate: null, 
        currentSession: null 
      })
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only keep the required fields over app cycles
      partialize: (state) => ({
        history: state.history,
        streak: state.streak,
        lastWorkoutDate: state.lastWorkoutDate,
      }),
    }
  )
);
