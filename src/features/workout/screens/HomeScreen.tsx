import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useUserStore, useWorkoutStore } from '../../../store';
import { COLORS, SPACING } from '../../../core/theme/colors';
import { generateWorkout } from '../logic/generator';
import { Activity, Flame } from 'lucide-react-native';

export const HomeScreen = ({ navigation }: any) => {
  const user = useUserStore();
  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [space, setSpace] = useState<'small' | 'medium' | 'large'>('medium');
  const [duration, setDuration] = useState(20);

  const handleStartWorkout = () => {
    const exercises = generateWorkout({ durationMinutes: duration, energy, space });
    startWorkout({
      id: Date.now().toString(),
      exercises,
      completedCount: 0,
      duration: duration * 60,
    });
    navigation.navigate('Player');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Ready to move?</Text>
          <View style={styles.streakBadge}>
            <Flame color={COLORS.secondary} size={20} />
            <Text style={styles.streakText}>{user.streak} Day Streak</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Energy</Text>
          <View style={styles.row}>
            {['low', 'medium', 'high'].map(lvl => (
              <TouchableOpacity key={lvl} style={[styles.pill, energy === lvl && styles.pillSelected]} onPress={() => setEnergy(lvl as any)}>
                <Text style={styles.pillText}>{lvl.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Space</Text>
          <View style={styles.row}>
            {['small', 'medium', 'large'].map(lvl => (
              <TouchableOpacity key={lvl} style={[styles.pill, space === lvl && styles.pillSelected]} onPress={() => setSpace(lvl as any)}>
                <Text style={styles.pillText}>{lvl.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Duration</Text>
          <View style={styles.row}>
            {[10, 20, 30, 45].map(min => (
              <TouchableOpacity key={min} style={[styles.pill, duration === min && styles.pillSelected]} onPress={() => setDuration(min)}>
                <Text style={styles.pillText}>{min} min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
          <Activity color={COLORS.background} size={24} style={{ marginRight: 8 }} />
          <Text style={styles.startText}>Generate & Start</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.md },
  greeting: { color: COLORS.textPrimary, fontSize: 28, fontWeight: 'bold' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#333' },
  streakText: { color: COLORS.textPrimary, marginLeft: 6, fontWeight: 'bold' },
  card: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.lg },
  cardTitle: { color: COLORS.textSecondary, fontSize: 16, marginBottom: SPACING.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { borderWidth: 1, borderColor: COLORS.border, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  pillSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  pillText: { color: COLORS.textPrimary, fontWeight: '600' },
  startButton: { backgroundColor: COLORS.primary, padding: SPACING.lg, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.lg },
  startText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },
});
