import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUserStore } from '../store';

import { OnboardingScreen } from '../features/onboarding/screens/OnboardingScreen';
import { HomeScreen } from '../features/workout/screens/HomeScreen';
import { PlayerScreen } from '../features/player/screens/PlayerScreen';
import { ProgressScreen } from '../features/progress/screens/ProgressScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  console.log('[RootNavigator] Render started');
  const [isHydrated, setIsHydrated] = useState(false);
  const hasCompletedOnboarding = useUserStore(state => state.hasCompletedOnboarding);

  useEffect(() => {
    console.log('[RootNavigator] Initializing Hydration listener...');
    let isMounted = true;
    
    const unsub = useUserStore.persist.onFinishHydration(() => {
      console.log('[RootNavigator] Hydration complete event fired');
      if (isMounted) setIsHydrated(true);
    });
    
    if (useUserStore.persist.hasHydrated()) {
      console.log('[RootNavigator] Store already hydrated on mount');
      setIsHydrated(true);
    }
    
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  if (!isHydrated) {
    console.log('[RootNavigator] UI Blocked: Waiting for Hydration...');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log('[RootNavigator] Hydration cleared. Rendering Navigation Container...');

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
