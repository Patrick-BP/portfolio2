import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <View style={styles.separator} />
      
      {/* Monthly Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monthly Summary</Text>
        {/* Monthly summary content will go here */}
      </View>
      
      {/* Export Options Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Options</Text>
        {/* Export buttons will go here */}
      </View>
      
      {/* Filters Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Filters</Text>
        {/* Date range and category filters will go here */}
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
    marginTop: 40,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});