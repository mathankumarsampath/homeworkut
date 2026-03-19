import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useWorkoutStore, useUserStore } from '../../../store';
import { COLORS, SPACING } from '../../../core/theme/colors';
import { Award, CheckCircle, Clock } from 'lucide-react-native';

export const ProgressScreen = ({ navigation }: any) => {
  const { history } = useWorkoutStore();
  const user = useUserStore();

  const totalMinutes = Math.floor(history.reduce((acc, sess) => acc + sess.duration, 0) / 60);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Your Progress</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Award color={COLORS.secondary} size={32} />
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Clock color={COLORS.primary} size={32} />
            <Text style={styles.statValue}>{totalMinutes}m</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle color={COLORS.success} size={32} />
            <Text style={styles.statValue}>{history.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <Text style={styles.subtitle}>Recent History</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No workouts completed yet.</Text>
        ) : (
          history.map((sess, i) => (
            <View key={i} style={styles.historyItem}>
              <View>
                <Text style={styles.historyTitle}>{sess.exercises.length} Exercises</Text>
                <Text style={styles.historyDate}>{new Date(parseInt(sess.id)).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.historyDuration}>{Math.floor(sess.duration / 60)} min</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.lg },
  title: { color: COLORS.textPrimary, fontSize: 32, fontWeight: 'bold', marginBottom: SPACING.xl },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
  statCard: { backgroundColor: COLORS.surface, flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: 16, marginHorizontal: 4, borderWidth: 1, borderColor: COLORS.border },
  statValue: { color: COLORS.textPrimary, fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  statLabel: { color: COLORS.textSecondary, fontSize: 12 },
  homeButton: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 8, alignItems: 'center', marginBottom: SPACING.xl, borderWidth: 1, borderColor: COLORS.primary },
  homeButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  subtitle: { color: COLORS.textPrimary, fontSize: 20, fontWeight: 'bold', marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontStyle: 'italic' },
  historyItem: { backgroundColor: COLORS.surface, flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.lg, borderRadius: 12, marginBottom: SPACING.sm },
  historyTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: 'bold' },
  historyDate: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  historyDuration: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold' }
});
