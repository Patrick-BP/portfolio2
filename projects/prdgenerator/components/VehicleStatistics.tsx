import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface VehicleStatisticsProps {
  vehicleId: string;
  expenses: Array<{
    vehicleId: string;
    date: string;
    amount: number;
  }>;
}

export default function VehicleStatistics({ vehicleId, expenses }: VehicleStatisticsProps) {
  const monthlyData = expenses
    .filter(e => e.vehicleId === vehicleId)
    .reduce((acc, expense) => {
      const month = expense.date.substring(0, 7);
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(monthlyData).slice(-6),
    datasets: [{
      data: Object.values(monthlyData).slice(-6)
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vehicle Statistics</Text>
      
      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Monthly Expenses</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Expenses</Text>
          <Text style={styles.statValue}>
            ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average per Month</Text>
          <Text style={styles.statValue}>
            ${(Object.values(monthlyData).reduce((sum, val) => sum + val, 0) / 
              Object.keys(monthlyData).length || 1).toFixed(2)}
          </Text>
        </View>
      </View>
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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});