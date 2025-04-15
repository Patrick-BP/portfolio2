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
} from 'react-native';
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

const Settings = () => {
  const { logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [mileageRate, setMileageRate] = useState('0.655');
  const [useActualExpenses, setUseActualExpenses] = useState(false);

  const [vehicle, setVehicle] = useState({
    make: 'Toyota',
    model: 'Camry',
    year: '2019',
    license: 'ABC-1234',
  });

  const [profile, setProfile] = useState({
    name: 'John Driver',
    email: 'john.driver@example.com',
  });

  const [modalVehicleVisible, setModalVehicleVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while picking the image.');
    }
  };

  const handleSaveVehicle = () => setModalVehicleVisible(false);
  const handleSaveProfile = () => setModalProfileVisible(false);

  const cardClass = `rounded-lg shadow-sm p-4 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`;
  const textClass = `ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`;

  const HandleLogOut = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  return (
    <ScrollView className={`p-4 ${isDarkMode ? 'bg-[#111827]' : 'bg-blue-50'}`}>
      <Text className={`text-[24px] font-bold mb-4 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
        Settings
      </Text>

      {/* Profile Section */}
      <View className={cardClass}>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={handlePickImage}>
            <View className="bg-blue-100 rounded-full p-0.5 overflow-hidden w-[69px] h-[69px] items-center justify-center">
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-full h-full rounded-full" />
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
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300 placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-900'}`}
            />
            <TextInput
              placeholder="Email"
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              className={`border rounded-md p-2 mb-4 border-gray-300 ${isDarkMode ? 'text-gray-300 placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-900'}`}
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
              >
                <Text className="text-white">Save</Text>
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
            <ChevronRight size={18} stroke="#9ca3af" />
          </TouchableOpacity>
        </View>
        <Text className={`text-sm ${textClass}`}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
        <Text className={`text-sm ${textClass}`}>License: {vehicle.license}</Text>
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
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300 placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-900'}`}
            />
            <TextInput
              placeholder="Make"
              value={vehicle.make}
              onChangeText={(text) => setVehicle({ ...vehicle, make: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300 placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-900'}`}
            />
            <TextInput
              placeholder="Model"
              value={vehicle.model}
              onChangeText={(text) => setVehicle({ ...vehicle, model: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300 placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-900'}`}
            />
            <TextInput
              placeholder="License"
              value={vehicle.license}
              onChangeText={(text) => setVehicle({ ...vehicle, license: text })}
              className={`border rounded-md p-2 mb-2 border-gray-300 ${isDarkMode ? 'text-gray-300 placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-900'}`}
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
              >
                <Text className="text-white">Save</Text>
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
