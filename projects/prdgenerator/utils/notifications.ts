import * as Notifications from 'expo-notifications';
import { notificationSettings } from '../utils/notificationSettings';
import { Expense } from '../utils/storage'; // or wherever your Expense type is defined

export const notificationManager = {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleMonthlySummary(expenses: Expense[]) {
    const now = new Date();
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === now.getMonth() &&
             expenseDate.getFullYear() === now.getFullYear();
    });

    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Monthly Expense Summary',
        body: `Your total expenses for ${now.toLocaleString('default', { month: 'long' })}: $${total.toFixed(2)}`,
      },
      trigger: {
        type: 'calendar',
        day: 1,
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  },

  async sendExpenseReminder() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Expense Tracking Reminder',
        body: 'Don\'t forget to log your expenses for today!',
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
      },
    });
  },

  async sendHighExpenseAlert(amount: number, category: string) {
    const preferences = await notificationSettings.getPreferences();
    
    if (preferences.highExpenseAlert && amount >= preferences.highExpenseThreshold) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'High Expense Alert',
          body: `You've recorded a ${category} expense of $${amount.toFixed(2)}`,
          data: { type: 'high-expense', amount, category },
        },
        trigger: null, // Send immediately
      });
    }
  },

  async updateNotificationSchedule() {
    const preferences = await notificationSettings.getPreferences();
    
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    if (preferences.dailyReminder) {
      await this.sendExpenseReminder();
    }
    
    if (preferences.monthlySummary) {
      // Re-schedule monthly summary with current preferences
      const expenses = []; // You would need to get this from your storage
      await this.scheduleMonthlySummary(expenses);
    }
  },

  async sendWeeklySummary(expenses: Expense[]) {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= weekStart;
    });

    const total = weekExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categories = [...new Set(weekExpenses.map(exp => exp.category))];
    const categoryBreakdown = categories.map(cat => {
      const catTotal = weekExpenses
        .filter(exp => exp.category === cat)
        .reduce((sum, exp) => sum + exp.amount, 0);
      return `${cat}: $${catTotal.toFixed(2)}`;
    }).join('\n');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weekly Expense Summary',
        body: `Total: $${total.toFixed(2)}\n\nBreakdown:\n${categoryBreakdown}`,
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }
};