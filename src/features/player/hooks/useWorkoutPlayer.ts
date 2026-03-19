import { useState, useEffect } from 'react';
import { useWorkoutStore } from '../../../store';
import { speak, stopVoice } from '../../../core/utils/voice';
import { light, medium, success } from '../../../core/utils/haptics';

const MESSAGES = [
  "Great job!",
  "You're getting stronger!",
  "Consistency wins!"
];

export const useWorkoutPlayer = (onComplete: () => void) => {
  const { currentSession, endWorkout, streak } = useWorkoutStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const currentExercise = currentSession?.exercises[currentIndex];
  // Look forward for the next drill, ensuring bounds
  const nextExercise = currentSession?.exercises[currentIndex + 1];
  const totalExercises = currentSession?.exercises.length || 0;
  
  const isFinished = !currentSession || currentIndex >= totalExercises;

  // Automatically reset timers when context shifts
  useEffect(() => {
    if (!currentExercise || isFinished) return;
    
    if (!isResting) {
      setTimeLeft(currentExercise.defaultDuration);
    } else {
      setTimeLeft(15);
    }
  }, [currentIndex, isResting, currentExercise, isFinished]);

  // Main countdown driver
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      handleAutoTransition();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Orchestrates the auto-flow and triggers physical/auditory feedback
  const handleAutoTransition = () => {
    if (isResting) {
      // Transition from REST to WORK
      setIsResting(false);
      medium();
      if (nextExercise) {
        setCurrentIndex(i => i + 1);
        speak(`Start ${nextExercise.name}`);
      }
    } else {
      // Transition from WORK to REST or FINISH
      if (currentIndex === totalExercises - 1) {
        // Last exercise completed -> Finish Workout
        success();
        const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        speak(`Workout complete. ${msg}`);
        setIsActive(false);
        endWorkout();
        onComplete();
      } else {
        // More exercises -> Go to Rest
        setIsResting(true);
        light();
        speak(`Rest. Up next, ${nextExercise?.name}`);
      }
    }
  };

  const skip = () => {
     handleAutoTransition();
  };

  const togglePause = () => {
    if (!isActive) {
      if (timeLeft === currentExercise?.defaultDuration && currentIndex === 0 && !isResting) {
        speak(`Starting ${currentExercise.name}`);
        medium();
      }
    } else {
      stopVoice();
    }
    setIsActive(!isActive);
  };

  return {
    currentExercise,
    nextExercise,
    currentIndex,
    totalExercises,
    timeLeft,
    isActive,
    isResting,
    isFinished,
    streak,
    skip,
    togglePause
  };
};
