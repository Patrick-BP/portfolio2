import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Text } from 'react-native';
import ReceiptCamera from './ReceiptCamera';
import { storage } from '../utils/storage';

export default function AddExpenseForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [odometer, setOdometer] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);

  const handlePhotoTaken = (uri: string) => {
    setReceiptUri(uri);
    setShowCamera(false);
  };

  const handleSave = async () => {
    const expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description,
      odometer: odometer ? parseFloat(odometer) : undefined,
      receiptUrl: receiptUri,
      date: new Date().toISOString(),
      vehicleId: 'default', // This should be replaced with actual vehicle selection
    };

    const success = await storage.saveExpense({
      ...expense,
      receiptUrl: receiptUri || undefined
    });
    if (success) {
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setOdometer('');
      setReceiptUri(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Odometer Reading"
          value={odometer}
          onChangeText={setOdometer}
          keyboardType="numeric"
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setShowCamera(true)}
        >
          <Text style={styles.buttonText}>
            {receiptUri ? 'Receipt Added ✓' : 'Add Receipt Photo'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Expense</Text>
        </TouchableOpacity>

        <Modal visible={showCamera} animationType="slide">
          <ReceiptCamera onPhotoTaken={handlePhotoTaken} />
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#64748b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});