import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Expense Tracker</ThemedText>
      <ThemedView style={styles.separator} />
      
      {/* Quick Actions Section */}
      <ThemedView style={styles.quickActions}>
        <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
        {/* Add expense button and other quick actions will go here */}
      </ThemedView>
      
      {/* Recent Transactions Section */}
      <ThemedView style={styles.recentTransactions}>
        <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
        {/* Transaction list will go here */}
      </ThemedView>
    </ThemedView>
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
    marginTop: 40,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  quickActions: {
    marginBottom: 20,
  },
  recentTransactions: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});
