import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Upload } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

interface ExpenseFormProps {
  onSubmit: (expense: {
    category: string;
    date: string;
    description: string;
    amount: number;
    odometer?: number;
    previousOdometer?: number;
    gallons?: number;
    receipt?: any;
  }) => void;
  initialValues?: {
    category: string;
    date: string;
    description: string;
    amount: number;
    odometer?: number;
    previousOdometer?: number;
    gallons?: number;
  };
}

const categories = [
  'Fuel',
  'Maintenance',
  'Insurance',
  'Car Payment',
  'Phone',
  'Meals',
  'Tolls',
  'Cleaning',
  'Other',
];

const ExpenseForm = ({ onSubmit, initialValues }: ExpenseFormProps) => {
  const { isDarkMode } = useTheme();

  const [category, setCategory] = useState(initialValues?.category || '');
  const [date, setDate] = useState(initialValues?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(initialValues?.description || '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [odometer, setOdometer] = useState(initialValues?.odometer?.toString() || '');
  const [previousOdometer, setPreviousOdometer] = useState(initialValues?.previousOdometer?.toString() || '');
  const [gallons, setGallons] = useState(initialValues?.gallons?.toString() || '');
  const [receipt, setReceipt] = useState<any>(null);

  const tripDistance =
    odometer && previousOdometer
      ? Math.max(0, parseFloat(odometer) - parseFloat(previousOdometer))
      : 0;

  const mpg =
    tripDistance && gallons
      ? (tripDistance / parseFloat(gallons)).toFixed(1)
      : null;

  const pricePerGallon =
    amount && gallons
      ? (parseFloat(amount) / parseFloat(gallons)).toFixed(3)
      : null;

  const inputStyle = `w-full border rounded-md px-3 py-2 text-base ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-400 placeholder:text-gray-400' : 'bg-white text-gray-900 border-gray-300'}`;
  const labelStyle = `text-[14px]  font-semibold mb-1 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const handleSubmit = () => {
    if (!category || !date || !description || !amount) {
      alert('Please fill in all required fields');
      return;
    }
    if (category === 'Fuel' && (!odometer || !previousOdometer || !gallons)) {
      alert('Please enter odometer readings and gallons for fuel expenses');
      return;
    }

    onSubmit({
      category,
      date,
      description,
      amount: parseFloat(amount),
      receipt: receipt || undefined,
      odometer: odometer ? parseFloat(odometer) : undefined,
      previousOdometer: previousOdometer ? parseFloat(previousOdometer) : undefined,
      gallons: gallons ? parseFloat(gallons) : undefined,
    });

    if (!initialValues) {
      setCategory('');
      setDescription('');
      setAmount('');
      setReceipt(null);
      setOdometer('');
      setPreviousOdometer('');
      setGallons('');
    }
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const permission = source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission is required');
      return;
    }

    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });

    if (!result.canceled && result.assets.length > 0) {
      setReceipt(result.assets[0]);
    }
  };

  return (
    <ScrollView className="p-4 ">
      <View>
        <Text className={labelStyle}>Category</Text>
        <View className={`border rounded-md ${isDarkMode ? 'border-gray-400 bg-gray-800' : 'border-gray-300 bg-white'}`}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            dropdownIconColor={isDarkMode ? 'white' : 'black'}
            style={{
              color: isDarkMode ? '#e5e7eb' : '#111827',
              height: 55,
            }}
          >
            <Picker.Item label="Select a category" value="" style={{ color: isDarkMode ? '#e5e7eb' : '#111827' , backgroundColor: isDarkMode ? '#111827' : '#e5e7eb' }}/>
            {categories.map((cat) => (
              <Picker.Item label={cat} value={cat} key={cat}  style={{ color: isDarkMode ? '#e5e7eb' : '#111827' , backgroundColor: isDarkMode ? '#111827' : '#e5e7eb' }}/>
            ))}
          </Picker>
        </View>
      </View>

      {category === 'Fuel' && (
        <View className="space-y-4">
          <View>
            <Text className={labelStyle}>Previous Odometer</Text>
            <TextInput
              className={inputStyle}
              keyboardType="numeric"
              value={previousOdometer}
              onChangeText={setPreviousOdometer}
              placeholder="Previous mileage"
            />
          </View>
          <View>
            <Text className={labelStyle}>Current Odometer</Text>
            <TextInput
              className={inputStyle}
              keyboardType="numeric"
              value={odometer}
              onChangeText={setOdometer}
              placeholder="Current mileage"
            />
          </View>
          <View>
            <Text className={labelStyle}>Gallons</Text>
            <TextInput
              className={inputStyle}
              keyboardType="numeric"
              value={gallons}
              onChangeText={setGallons}
              placeholder="Gallons"
            />
          </View>
          <View className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {tripDistance > 0 && <Text>Trip Distance: {tripDistance} mi</Text>}
            {mpg && <Text>Fuel Efficiency: {mpg} MPG</Text>}
            {pricePerGallon && <Text>Price per Gallon: ${pricePerGallon}</Text>}
          </View>
        </View>
      )}

      <View>
        <Text className={labelStyle}>Date</Text>
        <TextInput
          className={inputStyle}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View>
        <Text className={labelStyle}>Description</Text>
        <TextInput
          className={inputStyle}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Gas at Shell"

        />
      </View>

      <View>
        <Text className={labelStyle}>Amount ($)</Text>
        <TextInput
          className={inputStyle}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
        />
      </View>

      <View>
        <Text className={labelStyle}>Receipt</Text>
        <View className="flex-row space-x-2 gap-4">
          <TouchableOpacity
            className={`flex-1 flex-row items-center px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            onPress={() => pickImage('camera')}
          >
            <Upload size={16} stroke={isDarkMode ? 'white' : 'black'} className="mr-2" />
            <Text className={isDarkMode ? 'text-white' : 'text-black'}> Scan Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 flex-row items-center px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
            onPress={() => pickImage('library')}
          >
            <Upload size={16} stroke={isDarkMode ? 'white' : 'black'} className="mr-2" />
            <Text className={isDarkMode ? 'text-white' : 'text-black'}> Upload Receipt</Text>
          </TouchableOpacity>
        </View>
        {receipt && (
          <Image
            source={{ uri: receipt.uri }}
            className="mt-2 w-32 h-32 rounded-md"
            resizeMode="cover"
          />
        )}
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-md mt-4"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center text-base font-semibold">
          {initialValues ? 'Update Expense' : 'Add Expense'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ExpenseForm;
