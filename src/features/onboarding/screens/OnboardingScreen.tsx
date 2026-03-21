import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated
} from 'react-native';
import { useUserStore } from '../../../store';
import { COLORS, SPACING, RADIUS } from '../../../core/theme/colors';
import { ms, vs, s } from '../../../core/theme/responsive';
import { ChevronRight } from 'lucide-react-native';

const GOALS = [
  { value: 'weight loss',      label: 'Weight Loss',      icon: '🔥', sub: 'Burn fat & feel lighter'           },
  { value: 'muscle gain',      label: 'Muscle Gain',      icon: '💪', sub: 'Build strength & size'             },
  { value: 'general fitness',  label: 'General Fitness',  icon: '⚡', sub: 'Stay active & healthy'            },
];
const EXPERIENCE = [
  { value: 'beginner',      label: 'Beginner',      sub: 'Just getting started'             },
  { value: 'intermediate',  label: 'Intermediate',  sub: 'Some training background'        },
  { value: 'advanced',      label: 'Advanced',      sub: 'Experienced athlete'             },
];
const EQUIPMENT = [
  { value: 'none',              label: 'No Equipment',       sub: 'Bodyweight only'      },
  { value: 'dumbbells',         label: 'Dumbbells',          sub: 'Free weights at home'  },
  { value: 'resistance bands',  label: 'Resistance Bands',   sub: 'Bands & accessories'  },
  { value: 'full gym',          label: 'Full Gym',           sub: 'All machines available' },
];

const STEPS = [
  { title: "What's your\nmain goal?",       subtitle: "Personalise your training plan." },
  { title: "Your experience\nlevel?",        subtitle: "We'll match the intensity for you." },
  { title: "Available\nequipment?",          subtitle: "We'll build workouts around what you have." },
];

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
    if (item === 'none') { setEquipment(['none']); return; }
    const filtered = equipment.filter(e => e !== 'none');
    if (filtered.includes(item)) setEquipment(filtered.filter(e => e !== item));
    else setEquipment([...filtered, item]);
  };

  const canProceed = (step === 0 && !!goal) || (step === 1 && !!experience) || step === 2;

  const renderStep = () => {
    if (step === 0) {
      return GOALS.map(item => (
        <TouchableOpacity
          key={item.value}
          style={[styles.option, goal === item.value && styles.optionSelected]}
          onPress={() => setGoal(item.value)}
          activeOpacity={0.75}
        >
          <Text style={styles.optionIcon}>{item.icon}</Text>
          <View style={styles.optionText}>
            <Text style={styles.optionLabel}>{item.label}</Text>
            <Text style={styles.optionSub}>{item.sub}</Text>
          </View>
          <View style={[styles.radio, goal === item.value && styles.radioSelected]}>
            {goal === item.value && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ));
    }
    if (step === 1) {
      return EXPERIENCE.map(item => (
        <TouchableOpacity
          key={item.value}
          style={[styles.option, experience === item.value && styles.optionSelected]}
          onPress={() => setExperience(item.value)}
          activeOpacity={0.75}
        >
          <View style={styles.optionText}>
            <Text style={styles.optionLabel}>{item.label}</Text>
            <Text style={styles.optionSub}>{item.sub}</Text>
          </View>
          <View style={[styles.radio, experience === item.value && styles.radioSelected]}>
            {experience === item.value && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>
      ));
    }
    return EQUIPMENT.map(item => (
      <TouchableOpacity
        key={item.value}
        style={[styles.option, equipment.includes(item.value) && styles.optionSelected]}
        onPress={() => toggleEquipment(item.value)}
        activeOpacity={0.75}
      >
        <View style={styles.optionText}>
          <Text style={styles.optionLabel}>{item.label}</Text>
          <Text style={styles.optionSub}>{item.sub}</Text>
        </View>
        <View style={[styles.checkbox, equipment.includes(item.value) && styles.checkboxSelected]}>
          {equipment.includes(item.value) && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressRow}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>Step {step + 1} of 3</Text>
        <Text style={styles.title}>{STEPS[step].title}</Text>
        <Text style={styles.subtitle}>{STEPS[step].subtitle}</Text>
      </View>

      {/* Options */}
      <View style={styles.options}>
        {renderStep()}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.button, !canProceed && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={!canProceed}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>{step === 2 ? "Let's Go!" : 'Continue'}</Text>
        <ChevronRight color={COLORS.background} size={20} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    justifyContent: 'center',
  },
  dot: {
    width: s(8), height: s(8), borderRadius: s(4),
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: s(24),
    backgroundColor: COLORS.primary,
  },
  dotDone: {
    backgroundColor: COLORS.primary,
    opacity: 0.4,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  stepLabel: {
    color: COLORS.primary,
    fontSize: ms(12),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: ms(26),
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    lineHeight: ms(34),
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: ms(14),
  },
  options: {
    flex: 1,
    gap: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryDim,
  },
  optionIcon: {
    fontSize: ms(24),
    width: s(36),
    textAlign: 'center',
  },
  optionText: { flex: 1 },
  optionLabel: {
    color: COLORS.textPrimary,
    fontSize: ms(15),
    fontWeight: '700',
    marginBottom: 2,
  },
  optionSub: {
    color: COLORS.textSecondary,
    fontSize: ms(12),
  },
  radio: {
    width: s(20), height: s(20), borderRadius: s(10),
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: {
    width: s(9), height: s(9), borderRadius: s(5),
    backgroundColor: COLORS.primary,
  },
  checkbox: {
    width: s(20), height: s(20), borderRadius: 6,
    borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkmark: { color: '#fff', fontSize: ms(12), fontWeight: 'bold' },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: vs(14),
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.md,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: {
    color: '#fff',
    fontSize: ms(16),
    fontWeight: 'bold',
  },
});
