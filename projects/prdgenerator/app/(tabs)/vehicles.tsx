import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native';

export default function VehiclesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicles</Text>
      <View style={styles.separator} />
      
      {/* Vehicle List Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Vehicles</Text>
        {/* Vehicle list will go here */}
      </View>
      
      {/* Add Vehicle Button Section */}
      <View style={styles.section}>
        {/* Add vehicle button will go here */}
      </View>
      
      {/* Vehicle Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Statistics</Text>
        {/* Vehicle stats will go here */}
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