// app/ui/EditExpenseModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";

type Expense = {
  _id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
};

type EditExpenseModalProps = {
  visible: boolean;
  onClose: () => void;
  expenses: Expense;
  onSaved: (updatedExpense: Expense) => void;
};

export default function EditExpenseModal({
  visible,
  onClose,
  expenses,
  onSaved,
}: EditExpenseModalProps) {
  const [description, setDescription] = useState(expenses.description);
  const [amount, setAmount] = useState(String(expenses.amount));

  useEffect(() => {
    setDescription(expenses.description);
    setAmount(String(expenses.amount));
  }, [expenses]);

  const handleSave = () => {
    if (!description || isNaN(parseFloat(amount))) {
      alert("Please enter valid data.");
      return;
    }

    onSaved({
      ...expenses,
      description,
      amount: parseFloat(amount),
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center bg-black/50"
      >
        <View className="bg-white w-11/12 rounded-xl p-4">
          <Text className="text-lg font-bold mb-4">Edit Expense</Text>

          <Text className="text-sm font-medium mb-1">Description</Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 mb-3"
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          <Text className="text-sm font-medium mb-1">Amount ($)</Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 mb-4"
            placeholder="Amount"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-md"
              onPress={onClose}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-md"
              onPress={handleSave}
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
