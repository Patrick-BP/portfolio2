import { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { storage, Expense } from '../utils/storage';

interface ExpenseSummary {
  totalAmount: number;
  categoryBreakdown: Record<string, number>;
  vehicleBreakdown: Record<string, number>;
}

export default function ExpenseReport() {
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalAmount: 0,
    categoryBreakdown: {},
    vehicleBreakdown: {},
  });

  useEffect(() => {
    loadExpenseSummary();
  }, []);

  const loadExpenseSummary = async () => {
    const expenses = await storage.getExpenses();
    const summary = calculateSummary(expenses);
    setSummary(summary);
  };

  const calculateSummary = (expenses: Expense[]): ExpenseSummary => {
    return expenses.reduce(
      (acc, expense) => {
        // Total amount
        acc.totalAmount += expense.amount;

        // Category breakdown
        acc.categoryBreakdown[expense.category] =
          (acc.categoryBreakdown[expense.category] || 0) + expense.amount;

        // Vehicle breakdown
        acc.vehicleBreakdown[expense.vehicleId] =
          (acc.vehicleBreakdown[expense.vehicleId] || 0) + expense.amount;

        return acc;
      },
      {
        totalAmount: 0,
        categoryBreakdown: {},
        vehicleBreakdown: {},
      } as ExpenseSummary
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Summary</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Expenses</Text>
        <Text style={styles.amount}>${summary.totalAmount.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {Object.entries(summary.categoryBreakdown).map(([category, amount]) => (
          <View key={category} style={styles.row}>
            <Text style={styles.label}>{category}</Text>
            <Text style={styles.value}>${amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Vehicle</Text>
        {Object.entries(summary.vehicleBreakdown).map(([vehicleId, amount]) => (
          <View key={vehicleId} style={styles.row}>
            <Text style={styles.label}>{vehicleId}</Text>
            <Text style={styles.value}>${amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    color: '#4b5563',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});


interface VehicleStats {
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  averageExpensePerMonth: number;
  totalMileage: number;
  fuelEfficiency?: number; // For fuel expenses only
}

interface EnhancedExpenseSummary extends ExpenseSummary {
  vehicleStats: Record<string, VehicleStats>;
  monthlyTrends: Record<string, number>;
}

const calculateEnhancedSummary = (expenses: Expense[]): EnhancedExpenseSummary => {
  const summary = expenses.reduce(
    (acc, expense) => {
      // Total amount
      acc.totalAmount += expense.amount;

      // Category breakdown
      acc.categoryBreakdown[expense.category] =
        (acc.categoryBreakdown[expense.category] || 0) + expense.amount;

      // Vehicle breakdown
      acc.vehicleBreakdown[expense.vehicleId] =
        (acc.vehicleBreakdown[expense.vehicleId] || 0) + expense.amount;

      return acc;
    },
    {
      totalAmount: 0,
      categoryBreakdown: {},
      vehicleBreakdown: {},
    } as ExpenseSummary
  );
  const vehicleStats: Record<string, VehicleStats> = {};
  const monthlyTrends: Record<string, number> = {};

  // Calculate vehicle-specific statistics
  expenses.forEach(expense => {
    if (!vehicleStats[expense.vehicleId]) {
      vehicleStats[expense.vehicleId] = {
        totalExpenses: 0,
        expensesByCategory: {},
        averageExpensePerMonth: 0,
        totalMileage: 0,
      };
    }

    const stats = vehicleStats[expense.vehicleId];
    stats.totalExpenses += expense.amount;
    stats.expensesByCategory[expense.category] = 
      (stats.expensesByCategory[expense.category] || 0) + expense.amount;
    
    if (expense.odometer) {
      stats.totalMileage = Math.max(stats.totalMileage, expense.odometer);
    }

    // Monthly trends
    const monthKey = expense.date.substring(0, 7); // YYYY-MM
    monthlyTrends[monthKey] = (monthlyTrends[monthKey] || 0) + expense.amount;
  });

  return {
    ...summary,
    vehicleStats,
    monthlyTrends,
  };
};