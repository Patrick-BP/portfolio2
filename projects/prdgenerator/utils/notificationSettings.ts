import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationPreferences {
  monthlySummary: boolean;
  dailyReminder: boolean;
  highExpenseAlert: boolean;
  reminderTime: {
    hour: number;
    minute: number;
  };
  highExpenseThreshold: number;
}

export const notificationSettings = {
  async getPreferences(): Promise<NotificationPreferences> {
    const defaultPreferences: NotificationPreferences = {
      monthlySummary: true,
      dailyReminder: true,
      highExpenseAlert: true,
      reminderTime: {
        hour: 20,
        minute: 0,
      },
      highExpenseThreshold: 100,
    };

    try {
      const stored = await AsyncStorage.getItem('notificationPreferences');
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch (error) {
      return defaultPreferences;
    }
  },

  async updatePreferences(preferences: Partial<NotificationPreferences>) {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      return false;
    }
  }
};