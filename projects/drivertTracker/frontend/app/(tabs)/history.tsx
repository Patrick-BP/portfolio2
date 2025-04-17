import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FilterIcon, SearchIcon, RefreshCw } from 'lucide-react-native';
import ExpenseCard from '@/app/ui/ExpenseCard';
import EditExpenseModal from '@/app/ui/EditExpenseModal';
import { useTheme } from '@/app/contexts/ThemeContext';
import useRequest from '@/app/services/useRequest';

const History = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const isMountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  type Expense = {
    _id: string;
    date: Date;
    category: string;
    description: string;
    amount: number;
  };

  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Fetch expenses from API
  const fetchExpenses = async () => {
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      const response = await useRequest({
        action: 'get',
        payload: {},
        path: 'expenses',
        
      });

      if (!isMountedRef.current) return;

      if (response.error) {
        Alert.alert('Error', response.error);
      } else if (response.data) {
        // Transform dates from strings to Date objects
        const formattedExpenses = response.data.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        }));
        setExpenses(formattedExpenses);
      }
    } catch (error) {
      if (isMountedRef.current) {
        Alert.alert('Error', 'Failed to fetch expenses');
        console.error('Error fetching expenses:', error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchExpenses();
  }, []);

  // Initial data fetch on component mount
  useEffect(() => {
    isMountedRef.current = true;
    fetchExpenses();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchExpenses();
  };

  const handleEdit = (id: string) => {
    const expense = expenses.find((e) => e._id === id);
    if (expense) {
      setSelectedExpense(expense);
      setModalVisible(true);
    }
  };

  // Update function
  const handleSave = async (updatedExpense: Expense) => {
    try {
      setLoading(true);
      
      // Format the expense data according to API expectations
      const payload = {
        category: updatedExpense.category,
        description: updatedExpense.description,
        amount: updatedExpense.amount,
        date: updatedExpense.date.toISOString(),
      };
      
      const response = await useRequest({
        action: 'patch',
        payload,
        path: 'expenses',
        id: updatedExpense._id, // ID is passed to identify the expense
      });

      if (response.error) {
        setLoading(false);
        Alert.alert('Error', response.error);
      } else {
        // Update local state only after successful API update
        setExpenses((prev) =>
          prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
        );
        Alert.alert('Success', 'Expense updated successfully');
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update expense');
      console.error('Error updating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const expense = expenses.find((e) => e._id === id);
    if (expense) {
      setExpenseToDelete(expense);
      setConfirmVisible(true);
    }
  };

  // Delete function
  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    
    try {
      setLoading(true);
      
      // Using post action for delete operation with a flag
      const response = await useRequest({
        action: 'delete', // Changed from 'put' to 'post' based on API expectation
        path: 'expenses',
        id: expenseToDelete._id, 
      });

      if (response.error) {
        Alert.alert('Error', response.error);
      } else {
        // Remove from local state after successful API delete
        setExpenses((prev) => prev.filter((e) => e._id !== expenseToDelete._id));
        Alert.alert('Success', 'Expense deleted successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense');
      console.error('Error deleting expense:', error);
    } finally {
      setLoading(false);
      setConfirmVisible(false);
      setExpenseToDelete(null);
    }
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
      expense.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      expense.category?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesCategory = selectedCategory
      ? expense.category === selectedCategory
      : true;

    const matchesStart = startDate ? expense.date >= startDate : true;
    const matchesEnd = endDate ? expense.date <= endDate : true;

    return matchesSearch && matchesCategory && matchesStart && matchesEnd;
  });
console.log("expenses",expenses)
  return (
    <ScrollView 
      className={`flex-1 ${isDarkMode ? 'bg-[#111827]' : 'bg-blue-50'} p-4`}
      contentContainerStyle={{ paddingBottom: 80 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[isDarkMode ? '#60a5fa' : '#3b82f6']} // Android
          tintColor={isDarkMode ? '#60a5fa' : '#3b82f6'} // iOS
          progressBackgroundColor={isDarkMode ? '#1f2937' : '#f9fafb'} // Android
        />
      }
    >
      <View className="flex-row justify-between items-center mb-4 mt-4">
        <Text className={`text-[24px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          Expense History
        </Text>
        <TouchableOpacity 
          onPress={handleRefresh}
          disabled={loading || refreshing}
          className="p-2"
        >
          <RefreshCw 
            size={20} 
            stroke={isDarkMode ? '#6b7280' : '#4b5563'} 
            className={refreshing ? 'animate-spin' : ''}
          />
        </TouchableOpacity>
      </View>

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

      {/* Loading State */}
      {loading && !refreshing && (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color={isDarkMode ? '#60a5fa' : '#3b82f6'} />
          <Text className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading expenses...
          </Text>
        </View>
      )}

      {/* Expense List */}
      {(!loading || refreshing) && (
        <View>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
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
      )}

      {/* Edit Modal */}
      {isModalVisible && selectedExpense && (
        <EditExpenseModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          expense={{ ...selectedExpense, date: selectedExpense.date.toISOString() }}
          onSave={(updatedExpense) =>
            handleSave({ ...updatedExpense, date: new Date(updatedExpense.date) })
          }
        />
      )}

      {/* Confirm Delete Modal */}
      {isConfirmVisible && expenseToDelete && (
        <View className="absolute inset-0 justify-center items-center bg-black/50 z-50">
          <View className={`p-6 rounded-xl w-11/12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Delete "{expenseToDelete.description}"?
            </Text>
            <Text className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this expense? This action cannot be undone.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                onPress={() => setConfirmVisible(false)}
              >
                <Text className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Cancel</Text>
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