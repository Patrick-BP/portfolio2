// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useRequest from '@/app/services/useRequest';

type User = {
  email: string;
  id?: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Decode JWT and check if expired
  const isTokenValid = (token: string): boolean => {
    try {
      const [, payloadBase64] = token.split('.');
      const decoded = JSON.parse(atob(payloadBase64));
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > currentTime;
    } catch (e) {
      console.error("Token decode failed:", e);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser && storedToken && isTokenValid(storedToken)) {
          setUser(JSON.parse(storedUser));
          router.push('/(tabs)');
        } else {
          await AsyncStorage.multiRemove(['user', 'token']);
          setUser(null);
          router.push('/welcome');
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
        router.push('/welcome');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await useRequest({
        action: 'post',
        payload: { email, password },
        path: 'auth',
        route: 'login',
      });

      if (error) throw new Error(error);

      if (data && data.token && data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/(tabs)');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await useRequest({
        action: 'post',
        payload: { name, email, password },
        path: 'auth',
        route: 'register',
      });

      if (error) throw new Error(error);

      if (data.payload && data.payload.user) {
        router.push('/(auth)/login');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['user', 'token']);
      setUser(null);
      router.push('/welcome');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, initialized, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
