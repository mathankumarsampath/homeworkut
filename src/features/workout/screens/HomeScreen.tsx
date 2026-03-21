import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
  StatusBar
} from 'react-native';
import { useWorkoutStore } from '../../../store';
import { COLORS, SPACING, RADIUS } from '../../../core/theme/colors';
import { ms, vs, s } from '../../../core/theme/responsive';
import { generateWorkout } from '../logic/generator';
import {
  Flame, ChevronRight, TrendingUp, BarChart2, Clock, Play
} from 'lucide-react-native';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TODAY_IDX = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

export const HomeScreen = ({ navigation }: any) => {
  const streak = useWorkoutStore(state => state.streak);
  const history = useWorkoutStore(state => state.history);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);

  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [space, setSpace] = useState<'small' | 'medium' | 'large'>('medium');
  const [duration, setDuration] = useState(20);

  const handleStartWorkout = () => {
    const exercises = generateWorkout({ durationMinutes: duration, energy, space });
    startWorkout({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises,
      duration: duration * 60,
    });
    navigation.navigate('Player');
  };

  const totalWorkouts = history.length;
  const totalMinutes = Math.floor(history.reduce((acc, s) => acc + s.duration, 0) / 60);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetSub}>Good morning 👋</Text>
            <Text style={styles.greeting}>Ready to train?</Text>
          </View>
          <TouchableOpacity
            style={styles.progressBtn}
            onPress={() => navigation.navigate('Progress')}
            activeOpacity={0.75}
          >
            <BarChart2 color={COLORS.primary} size={20} />
          </TouchableOpacity>
        </View>

        {/* ── WEEKLY STRIP ── */}
        <View style={styles.weekCard}>
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>Weekly Goal</Text>
            <View style={styles.streakBadge}>
              <Flame color={COLORS.secondary} size={14} />
              <Text style={styles.streakText}>{streak}d streak</Text>
            </View>
          </View>
          <View style={styles.weekDays}>
            {DAYS.map((d, i) => (
              <View key={i} style={styles.dayCol}>
                <Text style={[styles.dayLetter, i === TODAY_IDX && styles.dayLetterActive]}>{d}</Text>
                <View style={[
                  styles.dayCircle,
                  i === TODAY_IDX && styles.dayCircleToday,
                  i < TODAY_IDX && styles.dayCircleDone,
                ]}>
                  {i < TODAY_IDX && <Text style={styles.dayCheck}>✓</Text>}
                  {i === TODAY_IDX && <Text style={styles.dayNum}>{new Date().getDate()}</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── QUICK STATS ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { borderColor: COLORS.primary }]}>
            <TrendingUp color={COLORS.primary} size={20} />
            <Text style={styles.statVal}>{totalWorkouts}</Text>
            <Text style={styles.statLbl}>Workouts</Text>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.secondary }]}>
            <Clock color={COLORS.secondary} size={20} />
            <Text style={styles.statVal}>{totalMinutes}m</Text>
            <Text style={styles.statLbl}>Total Time</Text>
          </View>
          <View style={[styles.statCard, { borderColor: COLORS.success }]}>
            <Flame color={COLORS.success} size={20} />
            <Text style={styles.statVal}>{streak}</Text>
            <Text style={styles.statLbl}>Day Streak</Text>
          </View>
        </View>

        {/* ── BUILD WORKOUT ── */}
        <Text style={styles.sectionTitle}>Build Your Workout</Text>

        {/* Energy */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Today's Energy</Text>
          <View style={styles.pillRow}>
            {(['low', 'medium', 'high'] as const).map(lvl => (
              <TouchableOpacity
                key={lvl}
                style={[styles.pill, energy === lvl && styles.pillActive]}
                onPress={() => setEnergy(lvl)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, energy === lvl && styles.pillTextActive]}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Space */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Available Space</Text>
          <View style={styles.pillRow}>
            {(['small', 'medium', 'large'] as const).map(lvl => (
              <TouchableOpacity
                key={lvl}
                style={[styles.pill, space === lvl && styles.pillActive]}
                onPress={() => setSpace(lvl)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, space === lvl && styles.pillTextActive]}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Duration</Text>
          <View style={styles.pillRow}>
            {[10, 20, 30, 45].map(min => (
              <TouchableOpacity
                key={min}
                style={[styles.pill, duration === min && styles.pillActive]}
                onPress={() => setDuration(min)}
                activeOpacity={0.7}
              >
                <Text style={[styles.pillText, duration === min && styles.pillTextActive]}>
                  {min}m
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.startBtn} onPress={handleStartWorkout} activeOpacity={0.85}>
          <Play color="#fff" size={22} fill="#fff" />
          <Text style={styles.startBtnText}>Start Workout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: SPACING.md, marginBottom: SPACING.lg,
  },
  greetSub: { color: COLORS.textSecondary, fontSize: ms(12), marginBottom: 2 },
  greeting: { color: COLORS.textPrimary, fontSize: ms(22), fontWeight: 'bold' },
  progressBtn: {
    width: s(42), height: s(42), borderRadius: s(21),
    backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },

  // Weekly
  weekCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.lg, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  weekTitle: { color: COLORS.textPrimary, fontSize: ms(14), fontWeight: '700' },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  streakText: { color: COLORS.secondary, fontWeight: '700', fontSize: 13 },
  weekDays: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 6 },
  dayLetter: { color: COLORS.textTertiary, fontSize: 12, fontWeight: '600' },
  dayLetterActive: { color: COLORS.primary },
  dayCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center', justifyContent: 'center',
  },
  dayCircleToday: { backgroundColor: COLORS.primary },
  dayCircleDone: { backgroundColor: COLORS.primaryDim, borderWidth: 1, borderColor: COLORS.primary },
  dayCheck: { color: COLORS.primary, fontSize: 14, fontWeight: 'bold' },
  dayNum: { color: '#fff', fontSize: 13, fontWeight: 'bold' },

  // Stats
  statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'center', gap: 4,
    borderWidth: 1,
  },
  statVal: { color: COLORS.textPrimary, fontSize: 20, fontWeight: 'bold' },
  statLbl: { color: COLORS.textSecondary, fontSize: 11 },

  // Section
  sectionTitle: {
    color: COLORS.textPrimary, fontSize: 18, fontWeight: '700',
    marginBottom: SPACING.md,
  },

  // Build cards
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.lg,
    padding: SPACING.md, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardLabel: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: SPACING.sm },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
  },
  pillActive: { backgroundColor: COLORS.primaryDim, borderColor: COLORS.primary },
  pillText: { color: COLORS.textSecondary, fontWeight: '600', fontSize: 13 },
  pillTextActive: { color: COLORS.primary },

  // Start button
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.primary, paddingVertical: 18,
    borderRadius: RADIUS.full, marginTop: SPACING.md,
  },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
