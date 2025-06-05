import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  odometer?: number;
  receiptUrl?: string;
  date: string;
  vehicleId: string;
}

export const StorageKeys = {
  EXPENSES: 'expenses',
  VEHICLES: 'vehicles',
  USER: 'user',
};

export const storage = {
  async saveExpense(expense: Expense) {
    try {
      const expenses = await this.getExpenses();
      expenses.push(expense);
      await AsyncStorage.setItem(StorageKeys.EXPENSES, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error('Error saving expense:', error);
      return false;
    }
  },

  async getExpenses(): Promise<Expense[]> {
    try {
      const expenses = await AsyncStorage.getItem(StorageKeys.EXPENSES);
      return expenses ? JSON.parse(expenses) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  },

  async createBackup() {
    try {
      const backup = {
        expenses: await this.getExpenses(),
        vehicles: await this.getVehicles(),
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      const backupString = JSON.stringify(backup);
      const fileName = `vehicle_expense_backup_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, backupString);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      }

      return true;
    } catch (error) {
      console.error('Backup creation error:', error);
      return false;
    }
  },

  async restoreFromBackup(backupData: string) {
    try {
      const backup = JSON.parse(backupData);
      
      // Validate backup format
      if (!backup.expenses || !backup.vehicles || !backup.version) {
        throw new Error('Invalid backup format');
      }

      // Restore data
      await AsyncStorage.setItem(StorageKeys.EXPENSES, JSON.stringify(backup.expenses));
      await AsyncStorage.setItem(StorageKeys.VEHICLES, JSON.stringify(backup.vehicles));

      return true;
    } catch (error) {
      console.error('Restore error:', error);
      return false;
    }
  },

  async saveVehicle(vehicle: Vehicle): Promise<boolean> {
    try {
      const vehicles = await this.getVehicles();
      const updatedVehicles = [...vehicles, vehicle];
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      return true;
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      return false;
    }
  },

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const vehiclesJson = await AsyncStorage.getItem('vehicles');
      return vehiclesJson ? JSON.parse(vehiclesJson) : [];
    } catch (error) {
      console.error('Failed to get vehicles:', error);
      return [];
    }
  },

  async updateVehicle(vehicle: Vehicle): Promise<boolean> {
    try {
      const vehicles = await this.getVehicles();
      const updatedVehicles = vehicles.map(v => 
        v.id === vehicle.id ? vehicle : v
      );
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      return true;
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      return false;
    }
  },

  async deleteVehicle(vehicleId: string): Promise<boolean> {
    try {
      const vehicles = await this.getVehicles();
      const updatedVehicles = vehicles.filter(v => v.id !== vehicleId);
      await AsyncStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      return true;
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      return false;
    }
  }
};