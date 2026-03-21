import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar
} from 'react-native';
import { useWorkoutStore, useUserStore } from '../../../store';
import { COLORS, SPACING, RADIUS } from '../../../core/theme/colors';
import { ms, vs, s } from '../../../core/theme/responsive';
import { Award, Clock, CheckCircle, ArrowLeft, TrendingUp, Zap } from 'lucide-react-native';

export const ProgressScreen = ({ navigation }: any) => {
  const { history, streak } = useWorkoutStore();
  const user = useUserStore();

  const totalMinutes = Math.floor(history.reduce((acc, sess) => acc + sess.duration, 0) / 60);
  const totalExercises = history.reduce((acc, sess) => acc + sess.exercises.length, 0);

  const STATS = [
    { label: 'Day Streak',      value: `${streak}`,          unit: 'days',  icon: <Zap color={COLORS.secondary} size={22} />,    color: COLORS.secondary },
    { label: 'Total Time',      value: `${totalMinutes}`,    unit: 'min',   icon: <Clock color={COLORS.primary} size={22} />,     color: COLORS.primary },
    { label: 'Workouts Done',   value: `${history.length}`,  unit: 'sessions', icon: <CheckCircle color={COLORS.success} size={22} />, color: COLORS.success },
    { label: 'Exercises Done',  value: `${totalExercises}`,  unit: 'reps',  icon: <TrendingUp color="#A78BFA" size={22} />,       color: '#A78BFA' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')} activeOpacity={0.7}>
          <ArrowLeft color={COLORS.textPrimary} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── STAT GRID ── */}
        <View style={styles.statGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { borderColor: s.color + '40' }]}>
              <View style={[styles.statIconBg, { backgroundColor: s.color + '18' }]}>
                {s.icon}
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statUnit}>{s.unit}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── HISTORY ── */}
        <Text style={styles.sectionTitle}>Recent History</Text>

        {history.length === 0 ? (
          <View style={styles.emptyCard}>
            <Award color={COLORS.textTertiary} size={48} />
            <Text style={styles.emptyTitle}>No workouts yet</Text>
            <Text style={styles.emptyText}>Complete your first workout to see your progress here.</Text>
            <TouchableOpacity style={styles.startEmptyBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.startEmptyText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          history.map((sess, i) => {
            const date = new Date(parseInt(sess.id));
            const mins = Math.floor(sess.duration / 60);
            return (
              <View key={i} style={styles.historyCard}>
                <View style={styles.historyIconCol}>
                  <View style={styles.historyIcon}>
                    <CheckCircle color={COLORS.success} size={20} />
                  </View>
                  {i !== history.length - 1 && <View style={styles.historyLine} />}
                </View>
                <View style={styles.historyBody}>
                  <View style={styles.historyRow}>
                    <Text style={styles.historyTitle}>{sess.exercises.length} Exercises</Text>
                    <View style={styles.durationBadge}>
                      <Clock color={COLORS.primary} size={12} />
                      <Text style={styles.durationText}>{mins} min</Text>
                    </View>
                  </View>
                  <Text style={styles.historyDate}>
                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  {/* Exercise list preview */}
                  <Text style={styles.exercisePreview} numberOfLines={1}>
                    {sess.exercises.slice(0, 3).map(e => e.name).join(' · ')}{sess.exercises.length > 3 ? ` +${sess.exercises.length - 3}` : ''}
                  </Text>
                </View>
              </View>
            );
          })
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  backBtn: {
    width: s(42), height: s(42), borderRadius: s(21),
    backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: ms(16), fontWeight: '700' },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },

  // Grid
  statGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: '48%', backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, padding: SPACING.lg,
    borderWidth: 1, gap: 4,
  },
  statIconBg: {
    width: s(38), height: s(38), borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  statValue: { color: COLORS.textPrimary, fontSize: ms(24), fontWeight: 'bold' },
  statUnit: { color: COLORS.textSecondary, fontSize: ms(12) },
  statLabel: { color: COLORS.textTertiary, fontSize: ms(10), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },

  // Section
  sectionTitle: { color: COLORS.textPrimary, fontSize: ms(16), fontWeight: '700', marginBottom: SPACING.md },

  // Empty state
  emptyCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xxl,
    alignItems: 'center', gap: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  emptyTitle: { color: COLORS.textPrimary, fontSize: ms(16), fontWeight: 'bold', marginTop: SPACING.sm },
  emptyText: { color: COLORS.textSecondary, fontSize: ms(13), textAlign: 'center' },
  startEmptyBtn: {
    backgroundColor: COLORS.primaryDim, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, marginTop: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.primary,
  },
  startEmptyText: { color: COLORS.primary, fontWeight: '700', fontSize: ms(14) },

  // History
  historyCard: {
    flexDirection: 'row', gap: SPACING.md, marginBottom: 2,
  },
  historyIconCol: { alignItems: 'center', width: 36 },
  historyIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  historyLine: {
    flex: 1, width: 2, backgroundColor: COLORS.border,
    marginVertical: 4, marginLeft: 17,
  },
  historyBody: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg, padding: SPACING.md,
    marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  historyTitle: { color: COLORS.textPrimary, fontSize: ms(14), fontWeight: '700' },
  durationBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primaryDim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full,
  },
  durationText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  historyDate: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 4 },
  exercisePreview: { color: COLORS.textTertiary, fontSize: 12 },
});
