import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING } from '../../../core/theme/colors';
import { Play, Pause, SkipForward, SkipBack, Flame, AlertCircle, Info, X, Clock } from 'lucide-react-native';
import { Image } from 'react-native';
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
    hasSession,
    streak,
    skip,
    goToPrevious,
    togglePause,
    addRestTime
  } = useWorkoutPlayer(() => navigation.navigate('WorkoutComplete'));

  const [showInfo, setShowInfo] = useState(false);

  // REFS FOR TRANSITION & SPEECH CONTROL
  const lastSpokenKey = useRef<string | null>(null);
  const lastCountdown = useRef<number | null>(null);
  const prevIndex = useRef(currentIndex);
  const prevResting = useRef(isResting);
  const prevFinished = useRef(isFinished);
  const prevActive = useRef(isActive);
  
  // NEW RELIABLE SPEECH REFS
  const restDurationRef = useRef<number | null>(null);
  const isSpeakingRest = useRef(false);

  const speakSafe = async (text: string, key: string) => {
    if (lastSpokenKey.current === key) return;
    lastSpokenKey.current = key;
    await Speech.stop();
    Speech.speak(text);
  };

  // 🚀 INITIAL MOUNT EFFECT (Zero-latency start)
  useEffect(() => {
    if (!hasSession || isFinished || isResting || !currentExercise) return;

    const runInitialSpeech = async () => {
      const key = `exercise-${currentIndex}`;
      if (lastSpokenKey.current === key) return;
      lastSpokenKey.current = key;

      await Speech.stop();
      
      let speechText = '';
      if (currentIndex === 0) {
        speechText = `Start ${currentExercise.name}. Maintain proper form and control your breathing.`;
      } else {
        speechText = `Next exercise. ${currentExercise.name}. Keep your posture correct and breathe steadily.`;
      }

      // Add description if available
      if (currentExercise.description) {
        speechText += ` ${currentExercise.description}`;
      }

      Speech.speak(speechText);
    };

    runInitialSpeech();
  }, []);

  useEffect(() => {
    const handleFeedback = async () => {
      // 1. PRIORITY: FINAL COMPLETION
      if (isFinished && !prevFinished.current) {
        speakSafe('Workout complete. Fantastic effort today!', 'finished');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }

      // 2. PRIORITY: COUNTDOWN (5 -> 1)
      // Guard added: Do not interrupt rest announcement
      if (timeLeft <= 5 && timeLeft > 0 && isActive && !isSpeakingRest.current) {
        if (lastCountdown.current !== timeLeft) {
          lastCountdown.current = timeLeft;
          await Speech.stop();
          Speech.speak(`${timeLeft}`);
        }
        return; // Countdown overrides other speech
      }

      // 3. PRIORITY: REST START
      // FIX: Do NOT use timeLeft here — it holds the old exercise duration when isResting
      // first becomes true. The hook always resets rest to 15s, so we use that constant.
      if (!prevResting.current && isResting && !isFinished) {
        lastCountdown.current = null;
        restDurationRef.current = 15; // fixed rest duration from hook
        
        isSpeakingRest.current = true;
        await speakSafe(`Rest for ${restDurationRef.current} seconds`, `rest-${currentIndex}`);
        
        // Unlock countdown after rest announcement clears
        setTimeout(() => {
          isSpeakingRest.current = false;
        }, 1500);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // 4. PRIORITY: EXERCISE START (Upgrade: Coaching Mode)
      else if (!isResting && !isFinished && hasSession && currentExercise) {
        const indexChanged = prevIndex.current !== currentIndex;
        const restEnded = prevResting.current === true && isResting === false;
        const sessionStarted = prevActive.current === false && isActive === true && currentIndex === 0;

        if (indexChanged || restEnded || sessionStarted) {
          lastCountdown.current = null;
          isSpeakingRest.current = false; // Force reset if jumping phases
          
          let speechText = '';
          if (currentIndex === 0) {
            speechText = `Start ${currentExercise.name}. Maintain proper form and control your breathing.`;
          } else {
            speechText = `Next exercise. ${currentExercise.name}. Keep your posture correct and breathe steadily.`;
          }

          // Append description as requested for coaching
          if (currentExercise.description) {
            speechText += ` ${currentExercise.description}`;
          }

          speakSafe(speechText, `exercise-${currentIndex}`);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }

      // Sync state refs
      prevIndex.current = currentIndex;
      prevResting.current = isResting;
      prevFinished.current = isFinished;
      prevActive.current = isActive;
    };

    handleFeedback();
  }, [currentIndex, isResting, isFinished, hasSession, currentExercise, timeLeft, isActive]);

  // 1. Fail-safe: No active workout session
  if (!hasSession) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <AlertCircle color={COLORS.error} size={64} />
        <Text style={styles.fallbackTitle}>No Active Workout</Text>
        <Text style={styles.fallbackSubtitle}>Please generate a workout from the home screen first.</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>Go Back Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 2. Loading state while finishing up transitions
  if (isFinished) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.fallbackSubtitle, { marginTop: 12 }]}>Finishing workout...</Text>
      </SafeAreaView>
    );
  }

  // Calculate progress
  const progressPercentage = totalExercises > 0 
    ? ((currentIndex + (isResting ? 0.5 : 0)) / totalExercises) * 100 
    : 0;
  
  const isEnding = timeLeft <= 3 && timeLeft > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top HUD */}
      <View style={styles.header}>
        <View style={styles.streakBadge}>
          <Flame color={COLORS.secondary} size={16} />
          <Text style={styles.streakText}>🔥 {streak} Day Streak</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setShowInfo(true)} style={styles.infoButton} activeOpacity={0.7}>
            <Info size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {totalExercises}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
      </View>

      <View style={styles.main}>
        {/* PREMIUM PHASE LABEL */}
        <View style={[styles.phaseLabel, isResting && styles.phaseLabelResting]}>
          <Text style={styles.phaseLabelText}>
            {isResting ? 'REST' : 'EXERCISE'}
          </Text>
        </View>

        <Text style={styles.title}>{isResting ? 'Recovery' : currentExercise?.name}</Text>
        
        {/* TIMER ENGINE UI */}
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

        {/* RECOVERY ADJUSTMENT BUTTONS */}
        {isResting && (
          <View style={styles.adjustmentContainer}>
            <TouchableOpacity 
              style={styles.adjustBtn} 
              onPress={() => addRestTime(5)}
              activeOpacity={0.7}
            >
              <Clock size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.adjustText}>+5s</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.adjustBtn} 
              onPress={() => addRestTime(10)}
              activeOpacity={0.7}
            >
              <Clock size={14} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
              <Text style={styles.adjustText}>+10s</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isResting && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{currentExercise?.description}</Text>
          </View>
        )}
        
        {/* UP NEXT CONTEXT */}
        {nextExercise && (
           <View style={styles.upNextContainer}>
             <Text style={styles.upNextLabel}>Up Next</Text>
             <Text style={styles.upNextText}>{nextExercise.name}</Text>
           </View>
        )}
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlBtnSecondary} 
          onPress={goToPrevious} 
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <SkipBack color={currentIndex === 0 ? COLORS.border : COLORS.textPrimary} size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={togglePause} activeOpacity={0.8}>
          {isActive ? <Pause color="#fff" size={32} /> : <Play color="#fff" size={32} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtnSecondary} onPress={skip} activeOpacity={0.7}>
          <SkipForward color={COLORS.textPrimary} size={24} />
        </TouchableOpacity>
      </View>

      {/* INSTRUCTIONS MODAL */}
      <Modal
        visible={showInfo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentExercise?.name || 'Instructions'}</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.closeIcon}>
                <X color={COLORS.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {currentExercise?.image && (
                <View style={styles.modalImageContainer}>
                  <Image 
                    source={{ uri: currentExercise.image }}
                    style={styles.modalImage}
                    resizeMode="cover"
                  />
                </View>
              )}

              <Text style={styles.modalLabel}>Description</Text>
              <Text style={styles.modalText}>
                {currentExercise?.description || "No instructions available"}
              </Text>
              
              <View style={styles.safetyCard}>
                <AlertCircle color={COLORS.secondary} size={20} />
                <View style={styles.safetyContent}>
                  <Text style={styles.safetyLabel}>Safety Tip</Text>
                  <Text style={styles.safetyText}>
                    Focus on form over speed. Breathe steadily throughout the movement.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setShowInfo(false)}>
              <Text style={styles.closeButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fallbackContainer: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  fallbackTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: 'bold', marginTop: SPACING.md },
  fallbackSubtitle: { color: COLORS.textSecondary, fontSize: 16, textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xl },
  backButton: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 12 },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoButton: { padding: 4 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakText: { color: COLORS.secondary, fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  progressText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: 'bold' },
  
  progressBarContainer: { height: 4, backgroundColor: COLORS.surface, width: '100%' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary },
  
  main: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  phaseLabel: { backgroundColor: 'rgba(52, 199, 89, 0.15)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: SPACING.sm },
  phaseLabelResting: { backgroundColor: 'rgba(142, 142, 147, 0.15)' },
  phaseLabelText: { color: COLORS.secondary, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  
  title: { color: COLORS.textPrimary, fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.xl },
  
  timerCircle: { width: 220, height: 220, borderRadius: 110, borderWidth: 8, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
  timerCircleEnding: { borderColor: COLORS.error },
  timerCircleResting: { borderColor: COLORS.textSecondary },
  timerText: { color: COLORS.textPrimary, fontSize: 72, fontWeight: 'bold' },
  timerTextEnding: { color: COLORS.error, fontSize: 96 },
  
  descriptionContainer: { minHeight: 60, marginBottom: SPACING.xl },
  description: { color: COLORS.textSecondary, fontSize: 18, textAlign: 'center', paddingHorizontal: SPACING.md },
  
  upNextContainer: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 12, alignItems: 'center', minWidth: 220 },
  upNextLabel: { color: COLORS.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4, fontWeight: '700' },
  upNextText: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '600' },
  
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: SPACING.xxl, gap: SPACING.xl },
  controlBtn: { backgroundColor: COLORS.primary, width: 84, height: 84, borderRadius: 42, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  controlBtnSecondary: { backgroundColor: COLORS.surface, width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },

  // Adjustment Buttons
  adjustmentContainer: { flexDirection: 'row', gap: 12, marginBottom: SPACING.xl },
  adjustBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  adjustText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: SPACING.xl, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: 'bold' },
  closeIcon: { padding: 4 },
  modalBody: { marginBottom: SPACING.xl },
  modalImageContainer: { width: '100%', height: 220, borderRadius: 24, overflow: 'hidden', marginBottom: SPACING.xl, backgroundColor: COLORS.surface },
  modalImage: { width: '100%', height: '100%' },
  modalLabel: { color: COLORS.secondary, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  modalText: { color: COLORS.textSecondary, fontSize: 16, lineHeight: 24, marginBottom: SPACING.xl },
  safetyCard: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 16, flexDirection: 'row', gap: 12, alignItems: 'center' },
  safetyContent: { flex: 1 },
  safetyLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  safetyText: { color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 },
  closeButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.md, borderRadius: 16, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

