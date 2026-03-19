export type Equipment = 'none' | 'dumbbells' | 'resistance bands' | 'full gym';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'core' | 'arms' | 'shoulders' | 'full body';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: Equipment[];
  muscles: MuscleGroup[];
  difficulty: Difficulty;
  defaultDuration: number; 
  videoUrl?: string; 
  image?: string; 
}

export const EXERCISE_DB: Exercise[] = [
  { id: '1', name: 'Push-ups', description: 'Standard push-ups', equipment: ['none'], muscles: ['chest', 'arms', 'shoulders'], difficulty: 'beginner', defaultDuration: 40 },
  { id: '2', name: 'Squats', description: 'Bodyweight squats', equipment: ['none'], muscles: ['legs'], difficulty: 'beginner', defaultDuration: 45 },
  { id: '3', name: 'Plank', description: 'Core hold', equipment: ['none'], muscles: ['core'], difficulty: 'beginner', defaultDuration: 60 },
  { id: '4', name: 'Lunges', description: 'Alternating forward lunges', equipment: ['none'], muscles: ['legs'], difficulty: 'beginner', defaultDuration: 45 },
  { id: '5', name: 'Burpees', description: 'Full body cardio', equipment: ['none'], muscles: ['full body'], difficulty: 'intermediate', defaultDuration: 40 },
  { id: '6', name: 'Mountain Climbers', description: 'Fast core movements', equipment: ['none'], muscles: ['core', 'full body'], difficulty: 'intermediate', defaultDuration: 30 },
  { id: '7', name: 'Dumbbell Bench Press', description: 'Chest press with dumbbells', equipment: ['dumbbells', 'full gym'], muscles: ['chest', 'arms'], difficulty: 'intermediate', defaultDuration: 40 },
  { id: '8', name: 'Goblet Squat', description: 'Squat holding a dumbbell or kettlebell', equipment: ['dumbbells', 'full gym'], muscles: ['legs'], difficulty: 'beginner', defaultDuration: 45 },
  { id: '9', name: 'Dumbbell Rows', description: 'Bent over rows', equipment: ['dumbbells', 'full gym'], muscles: ['back', 'arms'], difficulty: 'intermediate', defaultDuration: 40 },
  { id: '10', name: 'Bicep Curls', description: 'Standing dumbbell curls', equipment: ['dumbbells', 'full gym'], muscles: ['arms'], difficulty: 'beginner', defaultDuration: 40 },
  { id: '11', name: 'Band Pull-Aparts', description: 'Shoulder and back exercise', equipment: ['resistance bands'], muscles: ['shoulders', 'back'], difficulty: 'beginner', defaultDuration: 30 },
  { id: '12', name: 'Banded Squat', description: 'Squat with band resistance', equipment: ['resistance bands'], muscles: ['legs'], difficulty: 'intermediate', defaultDuration: 45 },
  { id: '13', name: 'Pistol Squats', description: 'Single leg squats', equipment: ['none'], muscles: ['legs'], difficulty: 'advanced', defaultDuration: 30 },
  { id: '14', name: 'Diamond Push-ups', description: 'Tricep focused push-ups', equipment: ['none'], muscles: ['chest', 'arms'], difficulty: 'intermediate', defaultDuration: 30 },
  { id: '15', name: 'Pull-ups', description: 'Overhand strict pull-ups', equipment: ['full gym'], muscles: ['back', 'arms'], difficulty: 'advanced', defaultDuration: 40 },
];
