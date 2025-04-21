import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  FlatList,
} from "react-native";
import {
  WrenchIcon,
  CalendarIcon,
  CarIcon,
  Plus,
} from "lucide-react-native";
import StatCard from "@/app/ui/statCard";
import ExpenseCard from "@/app/ui/ExpenseCard";
import EditExpenseModal from "@/app/ui/EditExpenseModal";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/contexts/AuthContext";
import useRequest from "@/app/services/useRequest";
import { useFocusEffect } from "@react-navigation/native";



export default function Index() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [reports, setReports] = useState<MonthlyReport[]>([]);
 
  const fetchExpenses = async () => {
    try {
      const response = await useRequest({
        action: "get",
        payload: {},
        path: "expenses",
      });

      if (response.error === "Unauthorized") {
        Alert.alert("Error", "Unauthorized access. Please log in again.",[ { text: "OK", onPress: () => logout() } ]);
        
      } else if (response.error) {
        Alert.alert("Error", response.error);
      } else if (response.data) {
        const formattedExpenses = response.data.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
          createdAt: expense.createdAt ? new Date(expense.createdAt) : undefined,
        }));

        const sortedExpenses = formattedExpenses.sort((a: Expense, b: Expense) => {
          const dateA = a.createdAt?.getTime() ?? new Date(a.date).getTime();
          const dateB = b.createdAt?.getTime() ?? new Date(b.date).getTime();
          return dateB - dateA;
        });

        setRecentExpenses(sortedExpenses);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch expenses.");
    }
  };

  const fetchMonthlyReports = async () => {
    try {
      const response = await useRequest({
        action: "get",
        path: "reports",
        route: "monthly",
      });

      if (response.error === "Unauthorized") {
        Alert.alert("Error", "Unauthorized access. Please log in again.",[ { text: "OK", onPress: () => logout() } ]);
        
      } else if (response.error) {
        Alert.alert("Error", response.error);
      } else if (response.data) {
        setReports(response.data);
        
console.log(response.data);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch reports.");
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/welcome");
    } else {
      fetchExpenses();
      fetchMonthlyReports();
    }
  }, [user, loading]);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const mileageStats = {
    thisMonth: 610,
    totalMiles: 2850,
    businessMiles: 2450,
    mileageRate: 0.655,
  };

  const handleEdit = (id: string) => {
    const expense = recentExpenses.find((e) => e._id === id);
    if (expense) {
      setSelectedExpense(expense);
      setModalVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    const expense = recentExpenses.find((e) => e._id === id);
    if (expense) {
      setExpenseToDelete(expense);
      setConfirmVisible(true);
    }
  };

  const confirmDelete = () => {
    setRecentExpenses((prev) =>
      prev.filter((e) => e._id !== expenseToDelete?._id)
    );
    setConfirmVisible(false);
    setExpenseToDelete(null);
  };

  const handleSave = (updatedExpense: Expense) => {
    setRecentExpenses((prev) =>
      prev.map((e) => (e._id === updatedExpense._id ? updatedExpense : e))
    );
    setModalVisible(false);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-[#111827]" : "bg-blue-50"}`}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#1F2937" : "#fff"}
      />

      <View className="mt-4 mx-4">
        {/* <Text
          className={`text-[24px] font-bold ml-4 mb-4 ${
            isDarkMode ? "text-gray-300" : "text-gray-800"
          }`}
        >
          Dashboard
        </Text> */}

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between w-full">
          <StatCard
            title="This Month"
            value= {`$ ${reports[0]?.totalExpenses || 0}`}
            icon={<CalendarIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Miles Driven"
            value={`${reports[0]?.totalMileage || 0}`}
            icon={<CarIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            subtitle="This Month"
          />
          <StatCard
            title="Business Miles"
            value={(reports[0]?.totalMileage * 90 )/100}
            icon={<CarIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            subtitle={`$${(reports[0]?.totalMileage * mileageStats.mileageRate).toFixed(2)} Deduction`}
          />
          <StatCard
            title="Per Mile"
            value="$0.32"
            icon={<WrenchIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            subtitle="Avg. Operating Cost"
          />
        </View>

        {/* Recent Expenses */}
        <View className="mb-4 w-full">
          <View className="flex-row justify-between items-center mb-2">
            <Text
              className={`text-lg font-semibold ${
                isDarkMode ? "text-gray-300" : "text-gray-800"
              }`}
            >
              Recent Expenses
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/history");
              }}
              className="flex-row items-center" 
            >
            <Text className="text-sm text-blue-600">View All</Text>
            </TouchableOpacity>
          </View>
          <View style={{ maxHeight: 320 }}>
  <FlatList
    data={recentExpenses.slice(0, 5)}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <ExpenseCard
        _id={item._id}
        date={new Date(item.date).toLocaleDateString()}
        category={item.category}
        description={item.description}
        amount={item.amount}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )}
    ListEmptyComponent={<Text>No expenses found.</Text>}
    showsVerticalScrollIndicator={true}
  />
</View>
        </View>
      </View>

      {/* Quick Add Floating Button */}
      <TouchableOpacity
        className="absolute right-[180px] bottom-5 bg-blue-600 w-16 h-16 rounded-full justify-center items-center shadow-lg"
        aria-label="Quick add expense"
        onPress={() => {
          router.push("/addExpense");
        }}
      >
        <Plus size={35} stroke="white" />
      </TouchableOpacity>

      {/* Edit Expense Modal */}
      {isModalVisible && selectedExpense && (
        <EditExpenseModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          expenses={selectedExpense}
          onSaved={handleSave}
        />
      )}

      {/* Delete Confirmation Modal */}
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
    </View>
  );
}
