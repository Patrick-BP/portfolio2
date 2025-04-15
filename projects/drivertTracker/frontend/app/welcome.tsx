// app/welcome.tsx
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { images } from '@/constants/images';
import  * as Animatable from 'react-native-animatable';
import { Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { initialized, user } = useAuth();

  if (!initialized || user) {
    return null;
  }

  return (
    <View style = {styles.container}>
        <StatusBar barStyle={"light-content"}  />
        <View style={styles.header}>
            <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderRadius: 200, borderColor:'#05375a', borderWidth: 20, margin:60 }}>

            <Animatable.Image
                source={images.logo}
                animation="bounceIn"
                duration={1500}
                resizeMode="stretch"
                style={styles.logo}
                
            />
            </View>
        </View>
        <Animatable.View 
        style={styles.footer}
        animation="fadeInUpBig"
        >
            <Text style={styles.title}>Stay connect with everyone!</Text>
            <Text style={styles.text}>Sign in with account</Text>
            <View style={styles.button}>
                <TouchableOpacity onPress={() => router.push('/login')}>
                    <LinearGradient colors={['#5db8fe', '#39cff2']} style={styles.signIn} >
                    
                        {[<Text key="get-started" style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Get Started</Text>]}
                        <ChevronRight  size={20} color="white"/>
                    
                </LinearGradient>
                </TouchableOpacity>
                
            </View>
        </Animatable.View>
       
    </View>
  );
}

// const {height} = Dimensions.get('screen');
// const height_logo = height * 0.7 * 0.4;

const styles = {
  container: {  
    flex: 1,
    backgroundColor: '#111827',
  },
    header: {
        flex: 2,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        
    },
    footer: {
        flex: 1,
        paddingVertical: 50,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        backgroundColor: 'white',
    },
    logo: {
        width: 350,
        height: 350,
    },
    title: {
        color: '#111827',
        fontSize: 30,
        fontWeight: "700",
    },
    text: {
        color: 'grey',
        marginTop: 5,
        fontSize: 18,
    },
    button:{
        alignItems: 'flex-end' as const,
        marginTop: 30,
    },
    signIn: {
        
        width: 150,
        height: 40,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        borderRadius: 50,
        flexDirection: 'row' as const,
    },
}