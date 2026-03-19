import { EXERCISE_DB, Exercise, Equipment, MuscleGroup, Difficulty } from '../../../core/constants/mockData';
import { useUserStore } from '../../../store';

type EnergyLevel = 'low' | 'medium' | 'high';
type SpaceLevel = 'small' | 'medium' | 'large';

interface GeneratorParams {
  durationMinutes: number;
  energy: EnergyLevel;
  space: SpaceLevel;
  focusMuscles?: MuscleGroup[];
}

export const generateWorkout = (params: GeneratorParams): Exercise[] => {
  const user = useUserStore.getState();
  
  let availableExercises = EXERCISE_DB.filter(ex => 
    ex.equipment.some(eq => eq === 'none' || user.equipment.includes(eq))
  );

  if (params.energy === 'low') {
    availableExercises = availableExercises.filter(ex => ex.difficulty !== 'advanced');
  } else if (user.experience === 'beginner') {
    availableExercises = availableExercises.filter(ex => ex.difficulty === 'beginner');
  }

  if (params.space === 'small') {
    const highSpaceExercises = ['Mountain Climbers', 'Burpees', 'Lunges']; 
    availableExercises = availableExercises.filter(ex => !highSpaceExercises.includes(ex.name));
  }
  
  if (params.focusMuscles && params.focusMuscles.length > 0 && !params.focusMuscles.includes('full body')) {
    const specificExercises = availableExercises.filter(ex => 
      ex.muscles.some(m => params.focusMuscles?.includes(m))
    );
    if (specificExercises.length > 0) {
      availableExercises = specificExercises; 
    }
  }

  const targetDurationSeconds = params.durationMinutes * 60;
  let currentDuration = 0;
  const selected: Exercise[] = [];
  
  const shuffled = [...availableExercises].sort(() => 0.5 - Math.random());
  
  for (const ex of shuffled) {
    if (currentDuration + ex.defaultDuration <= targetDurationSeconds) {
      selected.push(ex);
      currentDuration += ex.defaultDuration + 15; 
    }
    if (currentDuration >= targetDurationSeconds - 60) break;
  }

  if (currentDuration < targetDurationSeconds / 2 && selected.length > 0) {
    const circuitRepeats = Math.floor(targetDurationSeconds / currentDuration);
    const baseCircuit = [...selected];
    for(let i = 1; i < circuitRepeats; i++) {
        selected.push(...baseCircuit);
    }
  }

  return selected;
};
