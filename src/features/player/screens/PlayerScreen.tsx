import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useWorkoutStore, useUserStore } from '../../../store';
import { COLORS, SPACING } from '../../../core/theme/colors';
import { Play, Pause, SkipForward } from 'lucide-react-native';

export const PlayerScreen = ({ navigation }: any) => {
  const { currentSession, endWorkout } = useWorkoutStore();
  const incrementStreak = useUserStore(state => state.incrementStreak);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);

  const currentExercise = currentSession?.exercises[currentIndex];
  const isFinished = !currentSession || currentIndex >= currentSession.exercises.length;

  useEffect(() => {
    if (currentExercise && !isResting) {
      setTimeLeft(currentExercise.defaultDuration);
    } else if (isResting) {
      setTimeLeft(15);
    }
  }, [currentIndex, isResting, currentExercise]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleNext = () => {
    if (isResting) {
      setIsResting(false);
      setCurrentIndex(i => i + 1);
    } else {
      if (currentSession && currentIndex === currentSession.exercises.length - 1) {
        incrementStreak();
        endWorkout();
        navigation.navigate('WorkoutComplete');
      } else {
        setIsResting(true);
      }
    }
  };

  if (isFinished) return <View style={styles.container}><Text style={styles.title}>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}>{currentIndex + 1} / {currentSession?.exercises.length}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.stateText}>{isResting ? 'REST' : 'WORK'}</Text>
        <Text style={styles.title}>{isResting ? 'Next: ' + currentSession?.exercises[currentIndex + 1]?.name : currentExercise?.name}</Text>
        <View style={styles.timerCircle}><Text style={styles.timerText}>{timeLeft}s</Text></View>
        {!isResting && <Text style={styles.description}>{currentExercise?.description}</Text>}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setIsActive(!isActive)}>
          {isActive ? <Pause color="#fff" size={32}/> : <Play color="#fff" size={32}/>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtnSecondary} onPress={handleNext}>
          <SkipForward color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.md, alignItems: 'center' },
  progress: { color: COLORS.textSecondary, fontSize: 16, fontWeight: 'bold' },
  main: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  stateText: { color: COLORS.secondary, fontSize: 24, fontWeight: 'bold', letterSpacing: 2, marginBottom: SPACING.sm },
  title: { color: COLORS.textPrimary, fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.xl },
  timerCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 8, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
  timerText: { color: COLORS.textPrimary, fontSize: 64, fontWeight: 'bold' },
  description: { color: COLORS.textSecondary, fontSize: 18, textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: SPACING.xxl, gap: SPACING.lg },
  controlBtn: { backgroundColor: COLORS.primary, width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  controlBtnSecondary: { backgroundColor: COLORS.surface, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }
});
