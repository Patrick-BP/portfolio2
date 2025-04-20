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

type Expense = {
  _id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  createdAt?: Date;
};

export default function Index() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
 
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
          const dateA = a.createdAt?.getTime() ?? a.date.getTime();
          const dateB = b.createdAt?.getTime() ?? b.date.getTime();
          return dateB - dateA;
        });

        setRecentExpenses(sortedExpenses);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch expenses.");
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/welcome");
    } else {
      fetchExpenses();
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
            value="$345.82"
            icon={<CalendarIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Miles Driven"
            value={`${mileageStats.thisMonth}`}
            icon={<CarIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            subtitle="This Month"
          />
          <StatCard
            title="Business Miles"
            value={mileageStats.businessMiles.toLocaleString()}
            icon={<CarIcon size={20} stroke={isDarkMode ? "#fff" : "#2563eb"} />}
            subtitle={`$${(mileageStats.businessMiles * mileageStats.mileageRate).toFixed(2)} Deduction`}
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
        date={item.date.toLocaleDateString()}
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


    </View>
  );
}
