import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  hasCompletedOnboarding: boolean;
  goal: string | null;
  experience: string | null;
  equipment: string[];
  
  setUser: (data: Partial<UserState>) => void;
  resetUser: () => void;
  
  // Utility for onboarding completion
  completeOnboarding: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      goal: null,
      experience: null,
      equipment: [],

      setUser: (data) => set(data),
      
      resetUser: () => set({ 
        hasCompletedOnboarding: false, 
        goal: null, 
        experience: null, 
        equipment: [] 
      }),
      
      completeOnboarding: (data) => set({ ...data, hasCompletedOnboarding: true })
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
