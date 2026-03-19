import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Ref for precise timer tracking - avoids drift compared to simple setInterval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise = currentSession?.exercises[currentIndex];
  const nextExercise = currentSession?.exercises[currentIndex + 1];
  const totalExercises = currentSession?.exercises.length || 0;
  
  const isFinished = !currentSession || (currentIndex >= totalExercises && totalExercises > 0);
  const hasSession = !!currentSession;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      stopVoice();
    };
  }, []);

  // Initialize/Reset timer when drill context shifts
  useEffect(() => {
    if (!currentExercise || isFinished) return;
    
    if (!isResting) {
      setTimeLeft(currentExercise.defaultDuration);
    } else {
      setTimeLeft(15);
    }
  }, [currentIndex, isResting, currentExercise, isFinished]);

  // High-precision countdown engine
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleAutoTransition();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleAutoTransition = useCallback(() => {
    if (isResting) {
      // REST -> WORK
      setIsResting(false);
      medium();
      if (nextExercise) {
        setCurrentIndex(i => i + 1);
      }
    } else {
      // WORK -> REST or FINISH
      if (currentIndex === totalExercises - 1) {
        // FINISH
        setIsActive(false);
        endWorkout();
        onComplete();
      } else {
        // WORK -> REST
        setIsResting(true);
      }
    }
  }, [isResting, currentIndex, totalExercises, endWorkout, onComplete, currentSession]);

  const skip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    handleAutoTransition();
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsResting(false);
      setCurrentIndex(i => i - 1);
      medium();
    }
  };

  const togglePause = () => {
    if (!isActive) {
      // Start sounds moved to screen for unified coaching
    } else {
      stopVoice();
    }
    setIsActive(!isActive);
  };

  const addRestTime = (seconds: number) => {
    if (isResting) {
      setTimeLeft(t => t + seconds);
    }
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
    hasSession,
    streak,
    skip,
    goToPrevious,
    togglePause,
    addRestTime
  };
};

