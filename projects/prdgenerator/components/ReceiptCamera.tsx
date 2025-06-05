import { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Camera, CameraType, CameraCapturedPicture } from 'expo-camera';
import { ThemedText } from '@/components/ThemedText';

export default function ReceiptCamera({ onPhotoTaken }: { onPhotoTaken: (uri: string) => void }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<typeof Camera>(null);

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo: CameraCapturedPicture = await (cameraRef.current as typeof Camera).takePictureAsync();
        onPhotoTaken(photo.uri);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>Request Camera Permission</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <ThemedText>No access to camera</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        ref={cameraRef}
        type={CameraType.back}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <ThemedText style={styles.buttonText}>Take Photo</ThemedText>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});