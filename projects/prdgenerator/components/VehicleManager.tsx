import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { storage } from '../utils/storage';

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
}

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    id: '',
    name: '',
    make: '',
    model: '',
    year: '',
    licensePlate: '',
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const savedVehicles = await storage.getVehicles() as Vehicle[];
    setVehicles(savedVehicles || []);
  };

  const handleSave = async () => {
    const vehicleToSave = {
      ...newVehicle,
      id: Date.now().toString(),
    };
    await storage.saveVehicle(vehicleToSave);
    setVehicles([...vehicles, vehicleToSave]);
    setNewVehicle({
      id: '',
      name: '',
      make: '',
      model: '',
      year: '',
      licensePlate: '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Vehicle Management</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Name"
          value={newVehicle.name}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Make"
          value={newVehicle.make}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, make: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Model"
          value={newVehicle.model}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, model: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Year"
          value={newVehicle.year}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, year: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="License Plate"
          value={newVehicle.licensePlate}
          onChangeText={(text) => setNewVehicle({ ...newVehicle, licensePlate: text })}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.vehicleList}>
        <Text style={styles.sectionTitle}>My Vehicles</Text>
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
            <Text style={styles.vehicleDetails}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.licensePlate}>{vehicle.licensePlate}</Text>
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
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  vehicleList: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  vehicleCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  vehicleDetails: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 4,
  },
  licensePlate: {
    fontSize: 14,
    color: '#6b7280',
  },
});