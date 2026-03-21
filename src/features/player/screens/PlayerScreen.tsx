import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ActivityIndicator, Modal, ScrollView, StatusBar, Image
} from 'react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, RADIUS } from '../../../core/theme/colors';
import { ms, vs, s } from '../../../core/theme/responsive';
import {
  Play, Pause, SkipForward, SkipBack, AlertCircle, Info, X, Clock, ChevronUp
} from 'lucide-react-native';
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

  // ── REFS FOR TRANSITION & SPEECH ──
  const lastSpokenKey   = useRef<string | null>(null);
  const lastCountdown   = useRef<number | null>(null);
  const prevIndex       = useRef(currentIndex);
  const prevResting     = useRef(isResting);
  const prevFinished    = useRef(isFinished);
  const prevActive      = useRef(isActive);
  const restDurationRef = useRef<number | null>(null);
  const isSpeakingRest  = useRef(false);

  const speakSafe = async (text: string, key: string) => {
    if (lastSpokenKey.current === key) return;
    lastSpokenKey.current = key;
    await Speech.stop();
    Speech.speak(text);
  };

  // 🚀 Zero-latency initial speech
  useEffect(() => {
    if (!hasSession || isFinished || isResting || !currentExercise) return;
    const runInitialSpeech = async () => {
      const key = `exercise-${currentIndex}`;
      if (lastSpokenKey.current === key) return;
      lastSpokenKey.current = key;
      await Speech.stop();
      let speechText = currentIndex === 0
        ? `Start ${currentExercise.name}. Maintain proper form and control your breathing.`
        : `Next exercise. ${currentExercise.name}. Keep your posture correct and breathe steadily.`;
      if (currentExercise.description) speechText += ` ${currentExercise.description}`;
      Speech.speak(speechText);
    };
    runInitialSpeech();
  }, []);

  // ── MAIN FEEDBACK EFFECT ──
  useEffect(() => {
    const handleFeedback = async () => {
      // 1. FINISH
      if (isFinished && !prevFinished.current) {
        speakSafe('Workout complete. Fantastic effort today!', 'finished');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }
      // 2. COUNTDOWN (5→1) — guarded against rest announcement
      if (timeLeft <= 5 && timeLeft > 0 && isActive && !isSpeakingRest.current) {
        if (lastCountdown.current !== timeLeft) {
          lastCountdown.current = timeLeft;
          await Speech.stop();
          Speech.speak(`${timeLeft}`);
        }
        return;
      }
      // 3. REST START
      if (!prevResting.current && isResting && !isFinished) {
        lastCountdown.current = null;
        restDurationRef.current = 15;
        isSpeakingRest.current = true;
        await speakSafe(`Rest for ${restDurationRef.current} seconds`, `rest-${currentIndex}`);
        setTimeout(() => { isSpeakingRest.current = false; }, 1500);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // 4. EXERCISE START
      else if (!isResting && !isFinished && hasSession && currentExercise) {
        const indexChanged   = prevIndex.current !== currentIndex;
        const restEnded      = prevResting.current === true && isResting === false;
        const sessionStarted = prevActive.current === false && isActive === true && currentIndex === 0;
        if (indexChanged || restEnded || sessionStarted) {
          lastCountdown.current = null;
          isSpeakingRest.current = false;
          let speechText = currentIndex === 0
            ? `Start ${currentExercise.name}. Maintain proper form and control your breathing.`
            : `Next exercise. ${currentExercise.name}. Keep your posture correct and breathe steadily.`;
          if (currentExercise.description) speechText += ` ${currentExercise.description}`;
          speakSafe(speechText, `exercise-${currentIndex}`);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
      prevIndex.current   = currentIndex;
      prevResting.current = isResting;
      prevFinished.current = isFinished;
      prevActive.current  = isActive;
    };
    handleFeedback();
  }, [currentIndex, isResting, isFinished, hasSession, currentExercise, timeLeft, isActive]);

  // ── FALLBACK: No session ──
  if (!hasSession) {
    return (
      <SafeAreaView style={styles.fallback}>
        <AlertCircle color={COLORS.error} size={56} />
        <Text style={styles.fallbackTitle}>No Active Workout</Text>
        <Text style={styles.fallbackSub}>Generate a workout from the home screen first.</Text>
        <TouchableOpacity style={styles.fallbackBtn} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.fallbackBtnText}>Go Back Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (isFinished) {
    return (
      <SafeAreaView style={styles.fallback}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.fallbackSub, { marginTop: 12 }]}>Finishing workout…</Text>
      </SafeAreaView>
    );
  }

  // ── COMPUTED VALUES ──
  const progress = totalExercises > 0
    ? ((currentIndex + (isResting ? 0.5 : 0)) / totalExercises) * 100 : 0;
  const isEnding = timeLeft <= 3 && timeLeft > 0;

  // Timer ring: 220px diameter, stroke ~10
  const RING = 104;       // radius from center
  const CIRC = 2 * Math.PI * RING;
  const maxTime = isResting ? 15 : (currentExercise?.defaultDuration ?? 40);
  const dashOffset = CIRC - (CIRC * (timeLeft / maxTime));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.phaseChip}>
          <Text style={[styles.phaseChipText, isResting && styles.phaseChipRest]}>
            {isResting ? '💤 REST' : '⚡ EXERCISE'}
          </Text>
        </View>
        <TouchableOpacity style={styles.infoBtn} onPress={() => setShowInfo(true)} activeOpacity={0.7}>
          <Info size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* ── PROGRESS BAR ── */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{currentIndex + 1} of {totalExercises}</Text>

      {/* ── EXERCISE NAME ── */}
      <Text style={styles.exerciseName} numberOfLines={2}>
        {isResting ? 'Recovery' : currentExercise?.name}
      </Text>

      {/* ── TIMER RING ── */}
      <View style={styles.timerWrapper}>
        {/* Dim ring */}
        <View style={[styles.timerRingBg, isResting && styles.timerRingRest, isEnding && styles.timerRingEnd]} />
        {/* Active ring (CSS-trick with border) */}
        <View style={[
          styles.timerRingActive,
          isEnding ? { borderColor: COLORS.error } : isResting ? { borderColor: COLORS.textSecondary } : { borderColor: COLORS.primary }
        ]} />
        <View style={styles.timerCenter}>
          <Text style={[styles.timerVal, isEnding && { color: COLORS.error }]}>
            {timeLeft}
          </Text>
          <Text style={styles.timerUnit}>sec</Text>
        </View>
      </View>

      {/* ── REST ADJUSTMENT ── */}
      {isResting && (
        <View style={styles.adjustRow}>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => addRestTime(5)} activeOpacity={0.7}>
            <Clock size={13} color={COLORS.primary} />
            <Text style={styles.adjustText}>+5s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => addRestTime(10)} activeOpacity={0.7}>
            <Clock size={13} color={COLORS.primary} />
            <Text style={styles.adjustText}>+10s</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── DESCRIPTION ── */}
      {!isResting && currentExercise?.description && (
        <View style={styles.descBox}>
          <Text style={styles.descText} numberOfLines={2}>{currentExercise.description}</Text>
        </View>
      )}

      {/* ── UP NEXT ── */}
      {nextExercise && (
        <View style={styles.upNext}>
          <ChevronUp color={COLORS.textTertiary} size={14} />
          <Text style={styles.upNextLabel}>Up next · </Text>
          <Text style={styles.upNextName}>{nextExercise.name}</Text>
        </View>
      )}

      {/* ── CONTROLS ── */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.ctrlSm, currentIndex === 0 && styles.ctrlDisabled]}
          onPress={goToPrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
        >
          <SkipBack color={currentIndex === 0 ? COLORS.textTertiary : COLORS.textPrimary} size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlMain} onPress={togglePause} activeOpacity={0.85}>
          {isActive
            ? <Pause color="#fff" size={32} />
            : <Play color="#fff" size={32} fill="#fff" />
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctrlSm} onPress={skip} activeOpacity={0.7}>
          <SkipForward color={COLORS.textPrimary} size={22} />
        </TouchableOpacity>
      </View>

      {/* ── INFO MODAL ── */}
      <Modal visible={showInfo} animationType="slide" transparent onRequestClose={() => setShowInfo(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentExercise?.name || 'Instructions'}</Text>
              <TouchableOpacity onPress={() => setShowInfo(false)} style={styles.modalClose}>
                <X color={COLORS.textSecondary} size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {currentExercise?.image && (
                <View style={styles.modalImgWrapper}>
                  <Image source={{ uri: currentExercise.image }} style={styles.modalImg} resizeMode="cover" />
                </View>
              )}

              <Text style={styles.modalSection}>Description</Text>
              <Text style={styles.modalBody}>
                {currentExercise?.description || 'No instructions available.'}
              </Text>

              <View style={styles.safetyBox}>
                <AlertCircle color={COLORS.secondary} size={18} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.safetyTitle}>Safety Tip</Text>
                  <Text style={styles.safetyBody}>
                    Focus on form over speed. Breathe steadily throughout the movement.
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.modalCta} onPress={() => setShowInfo(false)}>
              <Text style={styles.modalCtaText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  fallback: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg, gap: SPACING.sm },
  fallbackTitle: { color: COLORS.textPrimary, fontSize: ms(20), fontWeight: 'bold', marginTop: SPACING.sm },
  fallbackSub: { color: COLORS.textSecondary, fontSize: ms(13), textAlign: 'center' },
  fallbackBtn: { marginTop: SPACING.md, backgroundColor: COLORS.primaryDim, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primary },
  fallbackBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: ms(14) },

  // Top bar
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.xs },
  phaseChip: { backgroundColor: COLORS.surface, paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.border },
  phaseChipText: { color: COLORS.primary, fontSize: ms(11), fontWeight: '800', letterSpacing: 1 },
  phaseChipRest: { color: COLORS.textSecondary },
  infoBtn: { width: s(36), height: s(36), borderRadius: s(18), backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border },

  // Progress
  progressTrack: { height: 3, backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  progressLabel: { color: COLORS.textTertiary, fontSize: ms(11), fontWeight: '600', textAlign: 'right', paddingHorizontal: SPACING.lg, marginTop: 4, marginBottom: SPACING.xs },

  // Name
  exerciseName: { color: COLORS.textPrimary, fontSize: ms(24), fontWeight: 'bold', textAlign: 'center', paddingHorizontal: SPACING.xl, marginBottom: SPACING.md, lineHeight: ms(30) },

  // Timer Ring — sized for Realme 5i (360dp → ~200px ring)
  timerWrapper: { alignSelf: 'center', width: s(200), height: s(200), alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  timerRingBg: { position: 'absolute', width: s(200), height: s(200), borderRadius: s(100), borderWidth: s(9), borderColor: COLORS.surface },
  timerRingActive: { position: 'absolute', width: s(200), height: s(200), borderRadius: s(100), borderWidth: s(9), borderColor: COLORS.primary },
  timerRingRest: { borderColor: COLORS.border },
  timerRingEnd: { borderColor: COLORS.error },
  timerCenter: { alignItems: 'center' },
  timerVal: { color: COLORS.textPrimary, fontSize: ms(58), fontWeight: 'bold', lineHeight: ms(64) },
  timerUnit: { color: COLORS.textSecondary, fontSize: ms(13), fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },

  // Adjust
  adjustRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  adjustBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primaryDim, paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: RADIUS.full, borderWidth: 1, borderColor: COLORS.primary },
  adjustText: { color: COLORS.primary, fontSize: ms(12), fontWeight: '700' },

  // Description
  descBox: { backgroundColor: COLORS.surface, marginHorizontal: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  descText: { color: COLORS.textSecondary, fontSize: ms(13), lineHeight: ms(19) },

  // Up next
  upNext: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: SPACING.md },
  upNextLabel: { color: COLORS.textTertiary, fontSize: ms(12) },
  upNextName: { color: COLORS.textSecondary, fontSize: ms(12), fontWeight: '700' },

  // Controls
  controls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.lg, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg },
  ctrlMain: {
    width: s(72), height: s(72), borderRadius: s(36),
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 12, elevation: 8,
  },
  ctrlSm: {
    width: s(52), height: s(52), borderRadius: s(26),
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  ctrlDisabled: { opacity: 0.3 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.surface, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg, maxHeight: '85%' },
  modalHandle: { width: s(36), height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: SPACING.md },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { color: COLORS.textPrimary, fontSize: ms(18), fontWeight: 'bold', flex: 1 },
  modalClose: { width: s(34), height: s(34), borderRadius: s(17), backgroundColor: COLORS.surfaceElevated, alignItems: 'center', justifyContent: 'center' },
  modalImgWrapper: { width: '100%', height: vs(180), borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.lg, backgroundColor: COLORS.surfaceElevated },
  modalImg: { width: '100%', height: '100%' },
  modalSection: { color: COLORS.primary, fontSize: ms(10), fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  modalBody: { color: COLORS.textSecondary, fontSize: ms(14), lineHeight: ms(21), marginBottom: SPACING.lg },
  safetyBox: { backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, padding: SPACING.md, flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: SPACING.lg },
  safetyTitle: { color: COLORS.textPrimary, fontSize: ms(13), fontWeight: '700', marginBottom: 2 },
  safetyBody: { color: COLORS.textSecondary, fontSize: ms(12), lineHeight: ms(17) },
  modalCta: { backgroundColor: COLORS.primary, paddingVertical: vs(13), borderRadius: RADIUS.full, alignItems: 'center' },
  modalCtaText: { color: '#fff', fontSize: ms(15), fontWeight: 'bold' },
});
