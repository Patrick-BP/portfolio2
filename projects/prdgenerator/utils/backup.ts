import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface BackupData {
  expenses: any[];
  vehicles: any[];
  timestamp: string;
  version: string;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: number; // days
  lastBackupDate: string;
}

export const backup = {
  async createBackup() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      
      const backupData: BackupData = {
        expenses: JSON.parse(result.find(([key]) => key === 'expenses')?.[1] || '[]'),
        vehicles: JSON.parse(result.find(([key]) => key === 'vehicles')?.[1] || '[]'),
        timestamp: new Date().toISOString(),
        version: '1.0',
      };

      const fileName = `rideshare_backup_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, JSON.stringify(backupData));
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      }

      return true;
    } catch (error) {
      console.error('Backup creation failed:', error);
      return false;
    }
  },

  async restoreBackup(backupFile: string) {
    try {
      const backupData: BackupData = JSON.parse(backupFile);
      
      if (!backupData.version || !backupData.timestamp) {
        throw new Error('Invalid backup file format');
      }

      await AsyncStorage.multiSet([
        ['expenses', JSON.stringify(backupData.expenses)],
        ['vehicles', JSON.stringify(backupData.vehicles)],
      ]);

      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  },

  async scheduleBackup(settings: BackupSettings) {
    try {
      const lastBackup = new Date(settings.lastBackupDate);
      const now = new Date();
      const daysSinceLastBackup = Math.floor(
        (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (settings.autoBackup && daysSinceLastBackup >= settings.backupFrequency) {
        await this.createBackup();
        await AsyncStorage.setItem(
          'lastBackupDate',
          new Date().toISOString()
        );
      }
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  },

  async validateBackup(backupData: BackupData): Promise<boolean> {
    if (!backupData.version || !backupData.timestamp) {
      return false;
    }

    // Validate expenses data structure
    const validExpense = backupData.expenses.every(expense => 
      typeof expense.id === 'string' &&
      typeof expense.amount === 'number' &&
      typeof expense.category === 'string' &&
      typeof expense.date === 'string'
    );

    // Validate vehicles data structure
    const validVehicles = backupData.vehicles.every(vehicle =>
      typeof vehicle.id === 'string' &&
      typeof vehicle.name === 'string' &&
      typeof vehicle.make === 'string' &&
      typeof vehicle.model === 'string'
    );

    return validExpense && validVehicles;
  }
};