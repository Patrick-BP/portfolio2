import React, { useState } from 'react';
import { StyleSheet, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { backup } from '../utils/backup';
import * as DocumentPicker from 'expo-document-picker';

export default function SettingsManager() {
  const [autoBackup, setAutoBackup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleBackup = async () => {
    const success = await backup.createBackup();
    if (success) {
      Alert.alert('Success', 'Backup created successfully');
    } else {
      Alert.alert('Error', 'Failed to create backup');
    }
  };

  const handleRestore = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const success = await backup.restoreBackup(result.assets[0].uri);
        if (success) {
          Alert.alert('Success', 'Data restored successfully');
        } else {
          Alert.alert('Error', 'Failed to restore data');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick backup file');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Settings</ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
        <View style={styles.settingRow}>
          <ThemedText>Dark Mode</ThemedText>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data Management</ThemedText>
        <View style={styles.settingRow}>
          <ThemedText>Auto Backup</ThemedText>
          <Switch value={autoBackup} onValueChange={setAutoBackup} />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleBackup}>
          <ThemedText style={styles.buttonText}>Create Backup</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.restoreButton]} 
          onPress={handleRestore}
        >
          <ThemedText style={styles.buttonText}>Restore from Backup</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
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
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  restoreButton: {
    backgroundColor: '#64748b',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});