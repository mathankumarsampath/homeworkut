import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '../../../core/theme/colors';
import { Play, Pause, SkipForward, Flame } from 'lucide-react-native';
import { useWorkoutPlayer } from '../hooks/useWorkoutPlayer';

export const PlayerScreen = ({ navigation }: any) => {
  const {
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
  } = useWorkoutPlayer(() => navigation.navigate('WorkoutComplete'));

  // Failsafe rendering state
  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Calculate visual width for simple status bar.
  // Add 1 artificially if resting so the bar reflects "post-exercise" rest phase completion.
  const progressPercentage = ((currentIndex + (isResting ? 1 : 0)) / totalExercises) * 100;
  
  // Highlight logic for last 3 seconds
  const isEnding = timeLeft <= 3 && timeLeft > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top HUD: Psychological triggers and Status */}
      <View style={styles.header}>
        <View style={styles.streakBadge}>
          <Flame color={COLORS.secondary} size={16} />
          <Text style={styles.streakText}>🔥 {streak} Day Streak</Text>
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalExercises}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>

      <View style={styles.main}>
        <Text style={styles.stateText}>{isResting ? 'REST' : 'WORK'}</Text>
        <Text style={styles.title}>{isResting ? 'Recovery' : currentExercise?.name}</Text>
        
        {/* Timer UI scales up and turns red near the end */}
        <View style={[
          styles.timerCircle, 
          isEnding && styles.timerCircleEnding,
          isResting && styles.timerCircleResting
        ]}>
          <Text style={[
            styles.timerText, 
            isEnding && styles.timerTextEnding
          ]}>
            {timeLeft}s
          </Text>
        </View>

        {!isResting && (
          <Text style={styles.description}>{currentExercise?.description}</Text>
        )}
        
        {/* Next exercise context block */}
        {nextExercise && (
           <View style={styles.upNextContainer}>
             <Text style={styles.upNextLabel}>Up Next</Text>
             <Text style={styles.upNextText}>{nextExercise.name}</Text>
           </View>
        )}
      </View>

      {/* Primary Interaction Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={togglePause}>
          {isActive ? <Pause color="#fff" size={32} /> : <Play color="#fff" size={32} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtnSecondary} onPress={skip}>
          <SkipForward color="#fff" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakText: { color: COLORS.secondary, fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  progressText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: 'bold' },
  progressBarContainer: { height: 4, backgroundColor: COLORS.surface, width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary },
  
  main: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  stateText: { color: COLORS.secondary, fontSize: 24, fontWeight: 'bold', letterSpacing: 2, marginBottom: SPACING.sm },
  title: { color: COLORS.textPrimary, fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.xl },
  
  timerCircle: { width: 220, height: 220, borderRadius: 110, borderWidth: 8, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
  timerCircleEnding: { borderColor: COLORS.error },
  timerCircleResting: { borderColor: COLORS.textSecondary },
  timerText: { color: COLORS.textPrimary, fontSize: 72, fontWeight: 'bold' },
  timerTextEnding: { color: COLORS.error, fontSize: 96 },
  
  description: { color: COLORS.textSecondary, fontSize: 18, textAlign: 'center', marginBottom: SPACING.xl },
  upNextContainer: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 12, alignItems: 'center', minWidth: 200 },
  upNextLabel: { color: COLORS.textSecondary, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  upNextText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '600' },
  
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: SPACING.xxl, gap: SPACING.lg },
  controlBtn: { backgroundColor: COLORS.primary, width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  controlBtnSecondary: { backgroundColor: COLORS.surface, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }
});
