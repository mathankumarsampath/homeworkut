import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useUserStore } from '../../../store';
import { COLORS, SPACING } from '../../../core/theme/colors';

const GOALS = ['weight loss', 'muscle gain', 'general fitness'];
const EXPERIENCE = ['beginner', 'intermediate', 'advanced'];
const EQUIPMENT = ['none', 'dumbbells', 'resistance bands', 'full gym'];

export const OnboardingScreen = ({ navigation }: any) => {
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 0 && goal) setStep(1);
    else if (step === 1 && experience) setStep(2);
    else if (step === 2) {
      completeOnboarding({
        goal: goal as any,
        experience: experience as any,
        equipment: equipment.length > 0 ? (equipment as any) : ['none'],
      });
    }
  };

  const toggleEquipment = (item: string) => {
    if (item === 'none') {
      setEquipment(['none']);
      return;
    }
    const filtered = equipment.filter(e => e !== 'none');
    if (filtered.includes(item)) {
      setEquipment(filtered.filter(e => e !== item));
    } else {
      setEquipment([...filtered, item]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>What's your main goal?</Text>
            {GOALS.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.option, goal === item && styles.optionSelected]}
                onPress={() => setGoal(item)}
              >
                <Text style={styles.optionText}>{item.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 1:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Your experience level?</Text>
            {EXPERIENCE.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.option, experience === item && styles.optionSelected]}
                onPress={() => setExperience(item)}
              >
                <Text style={styles.optionText}>{item.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 2:
        return (
          <View style={styles.content}>
            <Text style={styles.title}>Available equipment?</Text>
            {EQUIPMENT.map(item => (
              <TouchableOpacity
                key={item}
                style={[styles.option, equipment.includes(item) && styles.optionSelected]}
                onPress={() => toggleEquipment(item)}
              >
                <Text style={styles.optionText}>{item.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>Step {step + 1} of 3</Text>
      </View>
      {renderStep()}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>{step === 2 ? "Let's Go!" : "Continue"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  progressHeader: { marginTop: SPACING.xl, marginBottom: SPACING.xxl },
  progressText: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  content: { flex: 1 },
  title: { fontSize: 28, color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: SPACING.xl, textAlign: 'center' },
  option: { backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: 12, marginBottom: SPACING.md, borderWidth: 2, borderColor: 'transparent' },
  optionSelected: { borderColor: COLORS.primary },
  optionText: { color: COLORS.textPrimary, fontSize: 18, textAlign: 'center', fontWeight: '600' },
  button: { backgroundColor: COLORS.primary, padding: SPACING.lg, borderRadius: 24, alignItems: 'center', marginBottom: SPACING.xl },
  buttonText: { color: COLORS.background, fontSize: 18, fontWeight: 'bold' },
});
