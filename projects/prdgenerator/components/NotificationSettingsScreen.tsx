import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Switch, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Text
} from 'react-native';

import { notificationSettings } from '../utils/notificationSettings';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NotificationSettingsScreen() {
  const [preferences, setPreferences] = useState({
    monthlySummary: true,
    dailyReminder: true,
    highExpenseAlert: true,
    reminderTime: {
      hour: 20,
      minute: 0,
    },
    highExpenseThreshold: 100,
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const savedPreferences = await notificationSettings.getPreferences();
    setPreferences(savedPreferences);
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);
    await notificationSettings.updatePreferences({ [key]: value });
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();
      handlePreferenceChange('reminderTime', { hour, minute });
    }
  };

  const validateThreshold = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid positive number');
      return false;
    }
    return true;
  };

  const handleThresholdChange = (value: string) => {
    if (validateThreshold(value)) {
      handlePreferenceChange('highExpenseThreshold', parseFloat(value));
    }
  };

  const resetToDefaults = async () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all notification settings to default values?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const defaultPreferences = await notificationSettings.getPreferences();
            setPreferences(defaultPreferences);
            await notificationSettings.updatePreferences(defaultPreferences);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <View style={styles.settingRow}>
          <Text>Monthly Summary</Text>
          <Switch
            value={preferences.monthlySummary}
            onValueChange={(value) => handlePreferenceChange('monthlySummary', value)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text>Daily Reminder</Text>
          <Switch
            value={preferences.dailyReminder}
            onValueChange={(value) => handlePreferenceChange('dailyReminder', value)}
          />
        </View>

        <View style={styles.settingRow}>
          <Text>High Expense Alerts</Text>
          <Switch
            value={preferences.highExpenseAlert}
            onValueChange={(value) => handlePreferenceChange('highExpenseAlert', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Settings</Text>
        
        <View style={styles.settingRow}>
          <Text>Reminder Time</Text>
          <Text 
            style={styles.timeText}
            onPress={() => setShowTimePicker(true)}
          >
            {`${preferences.reminderTime.hour}:${preferences.reminderTime.minute.toString().padStart(2, '0')}`}
          </Text>
        </View>

        <View style={styles.settingRow}>
          <Text>High Expense Threshold ($)</Text>
          <TextInput
            style={styles.input}
            value={preferences.highExpenseThreshold.toString()}
            onChangeText={(value) => handlePreferenceChange('highExpenseThreshold', parseFloat(value) || 0)}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Sample High Expense Alert</Text>
          <Text style={styles.previewText}>
            {`You've recorded an expense above $${preferences.highExpenseThreshold}`}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetToDefaults}
      >
        <Text style={styles.resetButtonText}>Reset to Defaults</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(new Date().setHours(preferences.reminderTime.hour, preferences.reminderTime.minute))}
          mode="time"
          is24Hour={true}
          onChange={handleTimeChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
    width: 80,
    textAlign: 'right',
  },
  timeText: {
    fontSize: 16,
    color: '#2563eb',
  },
  previewContainer: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewText: {
    color: '#4b5563',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});