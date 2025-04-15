// app/_layout.tsx
import { Slot, SplashScreen } from 'expo-router';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import AuthProvider from '@/app/contexts/AuthContext';
import { useEffect, useState } from 'react';
import LoadingScreen from '@/app/components/LoadingScreen';

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate loading assets or auth state
    const timer = setTimeout(() => {
      setIsReady(true);
      SplashScreen.hideAsync();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}

function InitialLayout() {
  return <Slot />;
}

export default RootLayout;