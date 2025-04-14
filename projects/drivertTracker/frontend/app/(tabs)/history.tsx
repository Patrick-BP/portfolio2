import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FilterIcon, SearchIcon } from 'lucide-react-native';
import ExpenseCard from '@/app/ui/ExpenseCard';
import EditExpenseModal from '@/app/ui/EditExpenseModal';
import { useTheme } from '@/app/contexts/ThemeContext';

const History = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const isMountedRef = useRef(true);

  type Expense = {
    id: string;
    date: Date;
    category: string;
    description: string;
    amount: number;
  };

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: new Date(2023, 4, 10), // May 10, 2023
      category: 'Fuel',
      description: 'Shell Gas Station',
      amount: 45.67,
    },
    {
      id: '2',
      date: new Date(2023, 4, 8),
      category: 'Maintenance',
      description: 'Oil Change',
      amount: 39.99,
    },
    {
      id: '3',
      date: new Date(2023, 4, 5),
      category: 'Tolls',
      description: 'Highway Toll',
      amount: 12.5,
    },
    {
      id: '4',
      date: new Date(2023, 4, 1),
      category: 'Insurance',
      description: 'Monthly Premium',
      amount: 150.0,
    },
    {
      id: '5',
      date: new Date(2023, 3, 28),
      category: 'Fuel',
      description: 'Chevron',
      amount: 42.75,
    },
    {
      id: '6',
      date: new Date(2023, 3, 25),
      category: 'Phone',
      description: 'Phone Bill',
      amount: 85.0,
    },
    {
      id: '7',
      date: new Date(2023, 3, 20),
      category: 'Meals',
      description: 'Lunch during shift',
      amount: 12.99,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleEdit = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setSelectedExpense(expense);
      setModalVisible(true);
    }
  };

  const handleSave = (updatedExpense: Expense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (expense) {
      setExpenseToDelete(expense);
      setConfirmVisible(true);
    }
  };

  const confirmDelete = () => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete?.id));
    setConfirmVisible(false);
    setExpenseToDelete(null);
  };

  const handleSearchChange = (value: string) => {
    if (isMountedRef.current) {
      setSearchTerm(value);
    }
  };

  const toggleFilter = () => {
    if (isMountedRef.current) {
      setFilterOpen((prev) => !prev);
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? expense.category === selectedCategory
      : true;

    const matchesStart = startDate ? expense.date >= startDate : true;
    const matchesEnd = endDate ? expense.date <= endDate : true;

    return matchesSearch && matchesCategory && matchesStart && matchesEnd;
  });

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#111827]' : 'bg-blue-50'} p-4`}>
      <Text className={`text-[24px] font-bold mb-4 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
        Expense History
      </Text>

      {/* Search and Filter */}
      <View className="mb-4 space-y-2">
        <View className="relative">
          <TextInput
            placeholder="Search expenses..."
            placeholderTextColor={isDarkMode ? '#6b7280' : '#9ca3af'}
            value={searchTerm}
            onChangeText={handleSearchChange}
            className={`pl-10 pr-10 py-2 rounded-md border text-base  w-[90%] ${isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-200' : 'bg-white text-gray-900 border-gray-300'}`}
          />
          <SearchIcon
            size={18}
            stroke={isDarkMode ? '#6b7280' : '#9ca3af'}
            style={{ position: 'absolute', left: 12, top: 12 }}
          />
          <TouchableOpacity
            onPress={toggleFilter}
            style={{ position: 'absolute', right: 12, top: 10 }}
          >
            <FilterIcon size={20} stroke={isDarkMode ? '#6b7280' : '#9ca3af'} />
          </TouchableOpacity>
        </View>

        {filterOpen && (
          <View className={`mt-2 p-3 border rounded-md shadow-sm space-y-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Text className={`font-medium mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Filter by:
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {['Fuel', 'Maintenance', 'Insurance', 'Tolls'].map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <TouchableOpacity
                    key={category}
                    onPress={() =>
                      setSelectedCategory(isSelected ? null : category)
                    }
                    className={`px-4 py-1 rounded-md border ${
                      isDarkMode
                        ? `${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-gray-700'}`
                        : `${isSelected ? 'bg-blue-100 border-blue-600' : 'border-gray-300 bg-gray-100'}`
                    }`}
                  >
                    <Text className={`${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>{category}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View>
              <Text className={`text-sm mb-1 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Date Range
              </Text>
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity onPress={() => setShowStartPicker(true)} className="flex-1">
                  <Text
                    className={`px-2 py-1 rounded-md border text-sm ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-200 border-gray-600'
                        : 'bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    {startDate ? startDate.toDateString() : 'Start'}
                  </Text>
                </TouchableOpacity>

                <Text className={isDarkMode ? 'text-gray-400 mx-4' : 'text-gray-600 mx-4'}>to</Text>

                <TouchableOpacity onPress={() => setShowEndPicker(true)} className="flex-1">
                  <Text
                    className={`px-2 py-1 rounded-md border text-sm ${
                      isDarkMode
                        ? 'bg-gray-800 text-gray-200 border-gray-600'
                        : 'bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    {endDate ? endDate.toDateString() : 'End'}
                  </Text>
                </TouchableOpacity>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) setStartDate(selectedDate);
                  }}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) setEndDate(selectedDate);
                  }}
                />
              )}
            </View>

            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(null);
                  setStartDate(null);
                  setEndDate(null);
                }}
                className={`px-3 py-1 mt-4 border rounded-md ${isDarkMode ? 'border-gray-600 text-gray-300 bg-gray-700' : 'border-gray-300 bg-gray-100 text-gray-800'}`}
              >
                <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilterOpen(false)}
                className="px-3 py-1 mt-4 ml-4 bg-blue-600 rounded-md"
              >
                <Text className="text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Expense List */}
      <View>
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              {...expense}
              date={expense.date.toDateString()}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Text className={`text-center p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No expenses found. Try adjusting your filters.
          </Text>
        )}
      </View>

      {/* Edit Modal */}
      {isModalVisible && selectedExpense && (
        <EditExpenseModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          expense={selectedExpense}
          onSave={handleSave}
        />
      )}

      {/* Confirm Delete Modal */}
      {isConfirmVisible && expenseToDelete && (
        <View className="absolute inset-0 justify-center items-center bg-black/50 z-50">
          <View className="bg-white p-6 rounded-xl w-11/12">
            <Text className="text-lg font-semibold mb-3">
              Delete "{expenseToDelete.description}"?
            </Text>
            <Text className="text-gray-600 mb-4">
              Are you sure you want to delete this expense? This action cannot be undone.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-200 rounded-md"
                onPress={() => setConfirmVisible(false)}
              >
                <Text className="text-gray-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-red-600 rounded-md"
                onPress={confirmDelete}
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default History;
