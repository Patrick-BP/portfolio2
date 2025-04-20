import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  Linking
  
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FilterIcon, SearchIcon, RefreshCw, X, Calendar, Tag, DollarSign, Info, Download } from 'lucide-react-native';
import ExpenseCard from '@/app/ui/ExpenseCard';
import EditExpenseModal from '@/app/ui/EditExpenseModal';
import { useTheme } from '@/app/contexts/ThemeContext';
import useRequest from '@/app/services/useRequest';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useAuth } from '@/app/contexts/AuthContext';

const History = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const isMountedRef = useRef(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();

  type Expense = {
    _id: string;
    date: Date;
    category: string;
    description: string;
    amount: number;
    createdAt?: string; // Add createdAt field for sorting
    receipt?: string | null; // Receipt URL
  };

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  
  // State for expense details modal
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);
  const [expenseDetails, setExpenseDetails] = useState<Expense | null>(null);

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

     if (response.error === "Unauthorized") {
             Alert.alert("Error", "Unauthorized access. Please log in again.",[ { text: "OK", onPress: () => logout() } ]);
             
           } else if (response.error) {
             Alert.alert("Error", response.error);
      } else if (response.data) {
        // Transform dates from strings to Date objects
        const formattedExpenses = response.data.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        }));
        
        // Sort expenses by createdAt or date (most recent first)
        const sortedExpenses = formattedExpenses.sort((a: Expense, b: Expense) => {
          // First try to sort by createdAt if available
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          // Fall back to sorting by date
          return b.date.getTime() - a.date.getTime();
        });
        
        setExpenses(sortedExpenses);
        applyFilters(sortedExpenses);
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

  // Apply filters to expenses
  const applyFilters = useCallback((expensesToFilter = expenses) => {
    const filtered = expensesToFilter.filter((expense) => {
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
    
    setFilteredExpenses(filtered);
  }, [searchTerm, selectedCategory, startDate, endDate, expenses]);


  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );
  
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

  // Apply filters when filter criteria change
  useEffect(() => {
    applyFilters();
  }, [applyFilters, searchTerm, selectedCategory, startDate, endDate]);

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

  // Show expense details
  const handleShowDetails = (id: string) => {
    const expense = expenses.find((e) => e._id === id);
    if (expense) {
      setExpenseDetails(expense);
      setDetailsModalVisible(true);
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
        id: updatedExpense._id,
      });

      if (response.error) {
        setLoading(false);
        Alert.alert('Error', response.error);
      } else {
        // Update local state only after successful API update
        const updatedExpenses = expenses.map((e) => 
          e._id === updatedExpense._id ? updatedExpense : e
        );
        setExpenses(updatedExpenses);
        applyFilters(updatedExpenses);
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
      
      const response = await useRequest({
        action: 'delete',
        path: 'expenses',
        id: expenseToDelete._id, 
      });

      if (response.error) {
        Alert.alert('Error', response.error);
      } else {
        // Remove from local state after successful API delete
        const updatedExpenses = expenses.filter((e) => e._id !== expenseToDelete._id);
        setExpenses(updatedExpenses);
        applyFilters(updatedExpenses);
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Modified ExpenseCard wrapper component with onPress handler
  const ExpenseCardWrapper = ({ item }: { item: Expense }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => handleShowDetails(item._id)}
      className="mb-2"
    >
      <ExpenseCard
        _id={item._id}
        category={item.category}
        description={item.description}
        amount={item.amount}
        date={item.date.toDateString()}
        onEdit={() => handleEdit(item._id)}
        onDelete={() => handleDelete(item._id)}
      />
    </TouchableOpacity>
  );

  // Render empty list component
  const renderEmptyList = () => (
    <Text className={`text-center p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      No expenses found. Try adjusting your filters.
    </Text>
  );

  // Key extractor for FlatList
  const keyExtractor = (item: Expense) => item._id;

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#111827]' : 'bg-blue-50'}`}>
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4 mt-4">
          {/* <Text className={`text-[24px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            Expense History
          </Text> */}
          {/* <TouchableOpacity 
            onPress={handleRefresh}
            disabled={loading || refreshing}
            className="p-2"
            
          >
            <RefreshCw 
              size={20} 
              stroke={isDarkMode ? '#6b7280' : '#4b5563'} 
              className={refreshing ? 'animate-spin' : ''}
            />
          </TouchableOpacity> */}
        </View>

        {/* Search and Filter */}
        <View className="mb-4 space-y-2">
          <View className="relative">
            <TextInput
              placeholder="Search expenses..."
              placeholderTextColor={isDarkMode ? '#6b7280' : '#9ca3af'}
              value={searchTerm}
              onChangeText={handleSearchChange}
              className={`pl-10 pr-10 py-2 rounded-md border text-base w-[90%] ${isDarkMode ? 'bg-gray-800 text-gray-200 border-gray-200' : 'bg-white text-gray-900 border-gray-300'}`}
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
                      setShowStartPicker(Platform.OS === 'ios');
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
                      setShowEndPicker(Platform.OS === 'ios');
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

      {/* Expense List with FlatList */}
      <FlatList
        data={filteredExpenses}
        renderItem={({ item }) => <ExpenseCardWrapper item={item} />}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingBottom: 80,
          flexGrow: filteredExpenses.length === 0 ? 1 : undefined 
        }}
        ListEmptyComponent={loading ? null : renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDarkMode ? '#60a5fa' : '#3b82f6']} // Android
            tintColor={isDarkMode ? '#60a5fa' : '#3b82f6'} // iOS
            progressBackgroundColor={isDarkMode ? '#1f2937' : '#f9fafb'} // Android
          />
        }
      />

      {/* Expense Details Modal */}


<Modal
  animationType="fade"
  transparent
  visible={isDetailsModalVisible}
  onRequestClose={() => setDetailsModalVisible(false)}
>
  <View className="flex-1 justify-center items-center bg-black/80 px-4">
    <View
      className={`w-full max-w-md rounded-2xl p-6 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className={`text-2xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Expense Details
        </Text>
        <TouchableOpacity
          onPress={() => setDetailsModalVisible(false)}
          className="p-2 rounded-full bg-black/10 dark:bg-white/10"
        >
          <X size={24} stroke={isDarkMode ? '#d1d5db' : '#4b5563'} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {expenseDetails && (
        <View className="space-y-4">
          {/* Date */}
          <View className="flex-row items-center pb-3 border-b border-gray-300/30 dark:border-gray-700">
            <View className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl mr-3">
              <Calendar size={20} stroke={isDarkMode ? '#f3f4f6' : '#4b5563'} />
            </View>
            <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {expenseDetails.date.toDateString()}
            </Text>
          </View>

          {/* Category */}
          <View className="flex-row items-center pb-3 border-b border-gray-300/30 dark:border-gray-700">
            <View className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl mr-3">
              <Tag size={20} stroke={isDarkMode ? '#f3f4f6' : '#4b5563'} />
            </View>
            <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {expenseDetails.category}
            </Text>
          </View>

          {/* Description */}
          <View className="flex-row items-center pb-3 border-b border-gray-300/30 dark:border-gray-700">
            <View className="p-2 bg-purple-200 dark:bg-purple-800 rounded-xl mr-3">
              <Info size={20} stroke={isDarkMode ? '#ddd6fe' : '#6b21a8'} />
            </View>
            <Text className={`text-base font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
              {expenseDetails.description}
            </Text>
          </View>

          {/* Amount */}
          <View className="flex-row items-center pt-1">
            <View className="p-2 bg-green-100 dark:bg-green-900/40 rounded-xl mr-3">
              <DollarSign size={20} stroke={isDarkMode ? '#a7f3d0' : '#065f46'} />
            </View>
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
              {formatCurrency(expenseDetails.amount)}
            </Text>
          </View>

          {/* Receipt Download */}
          {expenseDetails.receipt && (
  <TouchableOpacity
    className="flex-row items-center mt-6 self-start px-4 py-2 rounded-md bg-indigo-600"
    onPress={async () => {
      try {
        const fileUrl = `http://192.168.0.233:3000${expenseDetails.receipt}`;
        const fileName = expenseDetails.receipt?.split('/').pop() || `receipt_${Date.now()}.jpg`;
        const downloadPath = `${FileSystem.documentDirectory}${fileName}`;

        // Step 1: Request media library permission
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Storage access is required to save the receipt.");
          return;
        }

        // Step 2: Download to temporary app directory
        const downloadResult = await FileSystem.downloadAsync(fileUrl, downloadPath);

        // Step 3: Save to downloads folder
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        }

        Alert.alert("Download Complete", "Receipt saved to Downloads folder.");
      } catch (error) {
        console.error("Download error:", error);
        Alert.alert("Download Failed", "Something went wrong.");
      }
    }}
  >
    <Download size={18} color="white" className="mr-2" />
    <Text className="text-white font-medium ml-3">Download Receipt</Text>
  </TouchableOpacity>
)}


        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-end space-x-4 gap-4 mt-8">
        <TouchableOpacity
          onPress={() => {
            setDetailsModalVisible(false);
            if (expenseDetails) handleEdit(expenseDetails._id);
          }}
          className="px-5 py-2 rounded-md bg-blue-600"
        >
          <Text className="text-white font-semibold">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setDetailsModalVisible(false);
            if (expenseDetails) handleDelete(expenseDetails._id);
          }}
          className="px-5 py-2 rounded-md bg-red-600"
        >
          <Text className="text-white font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
















      {/* Edit Modal */}
      {isModalVisible && selectedExpense && (
        <EditExpenseModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          expenses={{ ...selectedExpense, date: selectedExpense.date.toISOString() }}
          onSaved={(updatedExpense) =>
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
    </View>
  );
};

export default History;