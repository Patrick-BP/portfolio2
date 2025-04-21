import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {
  User,
  Car,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  AlertTriangle,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import useRequest from '../services/useRequest';
import { BASE_URL } from '@env';


const Settings = () => {
  const { logout, user} = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [mileageRate, setMileageRate] = useState('0.655');
  const [useActualExpenses, setUseActualExpenses] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    license: '',
    id: '',
  });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  const [modalVehicleVisible, setModalVehicleVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Fetch user and vehicle data
  useEffect(() => {
    fetchUserData();
    fetchVehicleData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const result = await useRequest({
        action: 'get',
        path: 'users',
        route: 'me',
      });

      if (result.error === "Unauthorized") {
              Alert.alert("Error", "Unauthorized access. Please log in again.",[ { text: "OK", onPress: () => logout() } ]);
              
            } else if (result.error) {
              Alert.alert("Error", result.error);}

      else if (result.data && !result.error) {
        setProfile({
          name: result.data.name || '',
          email: result.data.email || '',
        });
        setProfileImage(`${BASE_URL.slice(0, -6)}${result.data.profile_picture.slice(1)}`)
        
        if (result.data.profileImageUrl) {
          setProfileImage(result.data.profileImageUrl);
          console.log('Profile image:', result.data.profileImageUrl);
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      const result = await useRequest({
        action: 'get',
        path: 'vehicle',
      });

      if (result.data && !result.error) {
        setVehicle({
          make: result.data.make || '',
          model: result.data.model || '',
          year: result.data.year || '',
          license: result.data.license || '',
          id: result.data.id || '',
        });
      } else if (result.error) {
        console.log('No vehicle data found or error:', result.error);
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Request media permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your media library to upload a profile image.');
      }
    })();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
      })

      
      if (!result.canceled && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
        await uploadProfileImage(result);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while picking the image.');
    }
  };

  const uploadProfileImage = async (result: any) => {
    setUploadingImage(true);
    
    try {
      const asset = result.assets[0];

      const localUri = asset.uri;
      const filename = asset.fileName || `profile_${Date.now()}.jpg`;
      const extension = filename.split('.').pop()?.toLowerCase();
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';

      
      
      const fileToUpload = {
        uri: localUri.startsWith('file://') ? localUri : `file://${localUri}`,
        name: filename,
        type: mimeType,
      };
      
     
   
      
      // FormData instance
      const formData = new FormData();
      // @ts-ignore
      formData.append('profile_picture', fileToUpload);
      // Get the token for authorization
      const token = await AsyncStorage.getItem('token');
      
      
      // Make the request
      // const response = await fetch(`${BASE_URL}users/me`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Accept': 'application/json',
      //     ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      //     // Note: Don't set Content-Type when sending FormData
      //   },
      //   body: formData,
      // });

      const response = await useRequest({
        action: 'patch',
        path: 'users',
        route: 'me',
        payload: formData,
      });
      // Check if response is OK
      if (!response.error) {
        // Try to parse as JSON
        try {
          if (response.data.profileImageUrl) {
            setProfileImage(response.data.profileImageUrl);
          }
          Alert.alert('Success', 'Profile image updated successfully');
        } catch (parseError) {
          // If it's not JSON but the response was OK, still consider it a success
          console.log('Response not in JSON format but upload succeeded');
          Alert.alert('Success', 'Profile image updated successfully');
          // Refresh user data to get the updated image URL
          await fetchUserData();
        }
      } else {
        console.error('Error response:', response.error);
        
        // Try to get error details
        let errorMsg = 'Failed to upload profile image';
        try {
          const errorData = await response.error;
          errorMsg = errorData || errorMsg;
        } catch (parseError) {
          // If we can't parse the error as JSON, use a generic message
          console.log('Error response not in JSON format');
        }
        
        Alert.alert('Error', errorMsg);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload profile image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveVehicle = async () => {
    setLoading(true);
    
    try {
      const action = vehicle.id ? 'patch' : 'post';
      const id = vehicle.id || undefined;
      
      const payload = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license: vehicle.license,
      };
      
      const result = await useRequest({
        action,
        path: 'vehicle',
        id,
        payload,
      });
      
      if (!result.error) {
        // If it was a new vehicle, update the id
        if (!vehicle.id && result.data.id) {
          setVehicle(prev => ({ ...prev, id: result.data.id }));
        }
        
        Alert.alert('Success', 'Vehicle information saved successfully');
        setModalVehicleVisible(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to save vehicle information');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      Alert.alert('Error', 'Failed to save vehicle information');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      const result = await useRequest({
        action: 'patch',
        path: 'users',
        route: 'me',
        payload: {
          name: profile.name,
          email: profile.email,
        },
      });
      
      if (!result.error) {
        Alert.alert('Success', 'Profile updated successfully');
        setModalProfileVisible(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const HandleLogOut = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  const cardClass = `rounded-lg shadow-sm p-4 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const textClass = `ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`;

  if (loading && !profile.name) {
    return (
      <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-[#111827]' : 'bg-blue-50'}`}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className={`mt-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={`p-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-blue-50'}`}>
      {/* <Text className={`text-[24px] font-bold mb-4 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
        Settings
      </Text> */}

      {/* Profile Section */}
      <View className={cardClass}>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handlePickImage} disabled={uploadingImage}>
            <View className="bg-blue-100 rounded-full p-0.5 overflow-hidden w-[69px] h-[69px] items-center justify-center">
              {uploadingImage ? (
                <ActivityIndicator size="small" color="#2563eb" />
              ) : profileImage ? (
                <Image source={{ uri: `${profileImage}` }} className="w-full h-full rounded-full" />
              ) : (
                <User size={69} stroke="#2563eb" />
              )}
            </View>
          </TouchableOpacity>
          <View className="ml-3">
            <Text className={`font-medium mb-2 text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {profile.name}
            </Text>
            <Text className="text-sm text-slate-400">{profile.email}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setModalProfileVisible(true)}
          className="mt-3 w-full py-2 border border-blue-600 rounded-md"
        >
          <Text className="text-lg text-center text-blue-600">Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Edit Modal */}
      <Modal visible={modalProfileVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Edit Profile
            </Text>
            <TextInput
              placeholder="Name"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
            <TextInput
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              className={`border rounded-md p-2 mb-4 border-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalProfileVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Vehicle Info */}
      <View className={cardClass}>
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Car size={20} stroke="#2563eb" />
            <Text className={`font-medium text-lg ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
              Vehicle Information
            </Text>
          </View>
          <TouchableOpacity onPress={() => setModalVehicleVisible(true)}>
            <ChevronRight size={24} stroke="#9ca3af" />
          </TouchableOpacity>
        </View>
        {vehicle.make ? (
          <>
            <Text className={`text-sm ${textClass}`}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
            <Text className={`text-sm ${textClass}`}>License: {vehicle.license}</Text>
          </>
        ) : (
          <Text className={`text-sm ${textClass}`}>No vehicle information added</Text>
        )}
      </View>

      {/* Vehicle Edit Modal */}
      <Modal visible={modalVehicleVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-black/50 px-4">
          <View className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Edit Vehicle
            </Text>
            <TextInput
              placeholder="Year"
              value={vehicle.year}
              onChangeText={(text) => setVehicle({ ...vehicle, year: text })}
              keyboardType="numeric"
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              maxLength={4}
            />
            <TextInput
              placeholder="Make"
              value={vehicle.make}
              onChangeText={(text) => setVehicle({ ...vehicle, make: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
            <TextInput
              placeholder="Model"
              value={vehicle.model}
              onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
            <TextInput
              placeholder="License"
              value={vehicle.license}
              onChangeText={(text) => setVehicle({ ...vehicle, license: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVehicleVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveVehicle}
                className="px-4 py-2 bg-blue-600 rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white">Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Tax Settings */}
      <View className={cardClass}>
        <Text className={`font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          Tax Settings
        </Text>
        <View className="mb-3">
          <Text className={`text-sm mb-1 ${textClass}`}>Standard Mileage Rate ($/mile)</Text>
          <TextInput
            value={mileageRate}
            onChangeText={setMileageRate}
            keyboardType="decimal-pad"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
          />
          <Text className="text-xs text-slate-400 mt-1">Current IRS rate for 2023: $0.655/mile</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className={`text-sm ${textClass}`}>Use actual expenses</Text>
          <Switch value={useActualExpenses} onValueChange={setUseActualExpenses} />
        </View>
      </View>

      {/* Other Settings */}
      <View className={`${cardClass} space-y-3`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center mb-3">
            <Bell size={20} stroke="#2563eb" />
            <Text className={textClass}>Notifications</Text>
          </View>
          <ChevronRight size={18} stroke="#9ca3af" />
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center mb-3">
            <HelpCircle size={20} stroke="#2563eb" />
            <Text className={textClass}>Help & Support</Text>
          </View>
          <ChevronRight size={18} stroke="#9ca3af" />
        </View>

        <View className="flex-row items-center mb-3">
          <AlertTriangle size={20} stroke="#2563eb" />
          <Text className={textClass}>Privacy Policy</Text>
        </View>
      </View>

      {/* Dark Mode */}
      <View className={cardClass}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            {isDarkMode ? (
              <Moon size={20} stroke="#2563eb" />
            ) : (
              <Sun size={20} stroke="#2563eb" />
            )}
            <Text className={textClass}>Dark Mode</Text>
          </View>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity onPress={HandleLogOut} className="flex-row items-center justify-center py-3 border border-red-600 rounded-md mb-10">
        <LogOut size={18} stroke="#dc2626" />
        <Text className="text-red-600 ml-2"> Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Settings;