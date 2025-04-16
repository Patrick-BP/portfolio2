// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { router } from 'expo-router';
import useRequest from '@/app/services/useRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  register: (name: string , email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Auth initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is logged in (e.g., from AsyncStorage)
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          router.push('/(tabs)'); // Redirect to home page
        } else {
          setUser(null);
          router.push('/welcome'); // Redirect to login page
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
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
        route: 'login'
      });
      
      if (error) {
        throw new Error(error);
      }
      
      if (data && data.token && data.user) {
        // Store auth data
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        await AsyncStorage.setItem('token', data.token);
        
        // Update state
        setUser(data.user);
        
        // Navigate to home
        router.push('/(tabs)');
      } else {
        console.log('Invalid response from server');
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
        payload: {name, email, password },
        path: 'auth',
        route: 'register'
      });
      
      if (error) {
        throw new Error(error);
      }
      
      if (data.payload && data.payload.user) {
        // Don't set the user or token yet - they need to login
        router.push('/(auth)/login'); // Redirect to login after registration
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
     
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear stored auth data
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      
      // Update state
      setUser(null);
      
      // Navigate to login
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