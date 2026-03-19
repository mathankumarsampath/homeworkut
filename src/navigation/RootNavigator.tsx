import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserStore } from '../store';

import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { HomeScreen } from '../features/workout/screens/HomeScreen';
import { PlayerScreen } from '../features/player/screens/PlayerScreen';
import { ProgressScreen } from '../features/progress/screens/ProgressScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const hasCompletedOnboarding = useUserStore(state => state.hasCompletedOnboarding);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Player" component={PlayerScreen} options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="Progress" component={ProgressScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="WorkoutComplete" component={ProgressScreen} options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
