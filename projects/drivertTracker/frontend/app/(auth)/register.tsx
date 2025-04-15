// app/(auth)/register.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import * as Animatable from 'react-native-animatable';
import { User, Lock, Eye, CircleCheck , EyeOff, Mail} from 'lucide-react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { register, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [fullnameValid, setFullnameValid] = useState(false);

  useEffect(() => { 
    if (emailRegex.test(email)) {
    setEmailValid(true);
  }else{
    setEmailValid(false);
  }
if (fullname.length > 5) {
    setFullnameValid(true);
  }else{ 
    setFullnameValid(false);
  }

  }, [email, fullname]);



  const handleRegister = async () => {
    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Email validation
    
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // fullname validation
    if (fullname.length < 5) {
      setError('Fullname must be at least 3 characters');
      return;
    }

    try {
      setError('');
      await register(email, password);
      // Navigation is handled in the AuthContext after successful login
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
                
                    <Animatable.View
                        animation="bounceIn"
                    />
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>
                    </View>
               

            <Animatable.View 
                    style={styles.footer}
                    animation="fadeInUpBig"
                    >   
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.form}>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>


            <View style={{flexDirection:'row', alignItems:'center', width:'100%' }}>
            <User size={30} color={'#05375a'}/>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={fullname}
              onChangeText={setFullname}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <CircleCheck size={25} color={fullnameValid ? 'green' : 'gray'}/>
            </View>
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>


            <View style={{flexDirection:'row', alignItems:'center', width:'100%' }}>
            <Mail size={30} color={'#05375a'}/>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <CircleCheck size={25} color={emailValid ? 'green' : 'gray'}/>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>

            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Lock size={30} color={'#05375a'}/>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry = {!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={25} color={'green'} />: <EyeOff size={25} color={'gray'}/>}
            </TouchableOpacity>
            </View>
            

          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>

            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Lock size={30} color={'#05375a'}/>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry = {!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <Eye size={25} color={'green'} />: <EyeOff size={25} color={'gray'}/>}
            </TouchableOpacity>
            </View>
            

          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Already have an account</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.registerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Animatable.View> 
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        paddingBottom: 50,
        paddingTop: 20,
        
  },
  footer: {
      paddingBottom: 100,
      paddingVertical: 50,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 30,
      backgroundColor: 'white',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: 300,
    padding: 12,
    marginLeft: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
});


















