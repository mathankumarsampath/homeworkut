import { EXERCISE_DB, Exercise, MuscleGroup } from '../../../core/constants/exerciseData';
import { useUserStore } from '../../../store';

type EnergyLevel = 'low' | 'medium' | 'high';
type SpaceLevel  = 'small' | 'medium' | 'large';

interface GeneratorParams {
  durationMinutes: number;
  energy: EnergyLevel;
  space: SpaceLevel;
  focusMuscles?: MuscleGroup[];
}

// Space hierarchy — a large space also allows medium and small exercises
const SPACE_INCLUDES: Record<SpaceLevel, SpaceLevel[]> = {
  small:  ['small'],
  medium: ['small', 'medium'],
  large:  ['small', 'medium', 'large'],
};

// Energy hierarchy — high energy user also gets medium exercises, medium gets low
const ENERGY_INCLUDES: Record<EnergyLevel, EnergyLevel[]> = {
  low:    ['low'],
  medium: ['low', 'medium'],
  high:   ['low', 'medium', 'high'],
};

export const generateWorkout = (params: GeneratorParams): Exercise[] => {
  const user = useUserStore.getState();

  // 1. Equipment filter — include exercises that match at least one of the user's equipment
  let pool = EXERCISE_DB.filter(ex =>
    ex.equipment.some(eq => eq === 'none' || user.equipment.includes(eq))
  );

  // 2. Space filter — include exercises that fit within the available space
  const allowedSpaces = SPACE_INCLUDES[params.space];
  pool = pool.filter(ex => allowedSpaces.includes(ex.spaceRequired));

  // 3. Energy filter — match exercises to the chosen intensity level
  const allowedEnergies = ENERGY_INCLUDES[params.energy];
  pool = pool.filter(ex => allowedEnergies.includes(ex.energyLevel));

  // 4. Experience filter — beginners skip advanced; low energy caps at intermediate
  if (user.experience === 'beginner') {
    pool = pool.filter(ex => ex.difficulty === 'beginner');
  } else if (params.energy === 'low') {
    pool = pool.filter(ex => ex.difficulty !== 'advanced');
  }

  // 5. Optional muscle focus
  if (params.focusMuscles && params.focusMuscles.length > 0 && !params.focusMuscles.includes('full body')) {
    const focused = pool.filter(ex =>
      ex.muscles.some(m => params.focusMuscles!.includes(m))
    );
    if (focused.length >= 3) pool = focused;
  }

  // 6. Shuffle and fill to target duration
  const targetSeconds = params.durationMinutes * 60;
  const REST_BETWEEN  = 15; // seconds of rest counted per exercise
  let elapsed = 0;
  const selected: Exercise[] = [];

  const shuffled = [...pool].sort(() => 0.5 - Math.random());

  for (const ex of shuffled) {
    const needed = ex.defaultDuration + REST_BETWEEN;
    if (elapsed + needed <= targetSeconds) {
      selected.push(ex);
      elapsed += needed;
    }
    if (elapsed >= targetSeconds - 60) break;
  }

  // 7. If the pool was small, loop the circuit to fill the duration
  if (elapsed < targetSeconds / 2 && selected.length > 0) {
    const baseCircuit = [...selected];
    const repeats = Math.floor(targetSeconds / elapsed);
    for (let i = 1; i < repeats; i++) {
      selected.push(...baseCircuit);
    }
  }

  return selected;
};
