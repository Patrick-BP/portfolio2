import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { WrenchIcon, CalendarIcon, CarIcon, Plus } from "lucide-react-native";
import StatCard from "@/app/ui/statCard";
import ExpenseCard from "@/app/ui/ExpenseCard";
import EditExpenseModal from "@/app/ui/EditExpenseModal";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Index() {
  // Move ALL hooks to the top before any conditional logic
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Define types first
  type Expense = {
    id: string;
    date: string;
    category: string;
    description: string;
    amount: number;
  };

  // Define all useState hooks
  const [recentExpenses, setRecentExpenses] = useState([
    {
      id: "1",
      date: "May 10, 2023",
      category: "Fuel",
      description: "Shell Gas Station",
      amount: 45.67,
    },
    {
      id: "2",
      date: "May 8, 2023",
      category: "Maintenance",
      description: "Oil Change",
      amount: 39.99,
    },
    {
      id: "3",
      date: "May 5, 2023",
      category: "Tolls",
      description: "Highway Toll",
      amount: 12.5,
    },
    {
      id: "4",
      date: "May 5, 2023",
      category: "Tolls",
      description: "Highway Toll",
      amount: 12.5,
    },
    {
      id: "5",
      date: "May 5, 2023",
      category: "Tolls",
      description: "Highway Toll",
      amount: 12.5,
    },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Then useEffect hooks
  useEffect(() => {
    if (!loading && !user) {
      router.push("/welcome");
    }
  }, [user, loading, router]);

  

  const mileageStats = {
    thisMonth: 610,
    totalMiles: 2850,
    businessMiles: 2450,
    mileageRate: 0.655,
  };

  const handleEdit = (id: string) => {
    const expense = recentExpenses.find((e) => e.id === id);
    if (expense) {
      setSelectedExpense(expense as any);
      setModalVisible(true);
    }
  };

  const handleDelete = (id: string) => {
    const expense = recentExpenses.find((e) => e.id === id);
    if (expense) {
      setExpenseToDelete(expense as any);
      setConfirmVisible(true);
    }
  };

  const confirmDelete = () => {
    setRecentExpenses((prev) =>
      prev.filter((e) => e.id !== expenseToDelete?.id)
    );
    setConfirmVisible(false);
    setExpenseToDelete(null);
  };

  const handleSave = (updatedExpense: Expense) => {
    setRecentExpenses((prev) =>
      prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e))
    );
    setModalVisible(false);
  };

  return (
    <View className={`flex-1 ${isDarkMode ? "bg-[#111827]" : "bg-blue-50"}`}>
      <View style={{ flex: 1, paddingTop: 40 }}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#1F2937' : '#fff'} />
      </View>
      <ScrollView className="mt-0 mx-4">
        <Text className={`text-[24px] font-bold ml-4 mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
          Dashboard
        </Text>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between w-full ">
          <StatCard
            title="This Month"
            value="$345.82"
            icon={<CalendarIcon size={20} stroke={isDarkMode ? '#fff' : '#2563eb'} />}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Miles Driven"
            value={`${mileageStats.thisMonth}`}
            icon={<CarIcon size={20} stroke={isDarkMode ? '#fff' : '#2563eb'} />}
            subtitle="This Month"
          />
          <StatCard
            title="Business Miles"
            value={mileageStats.businessMiles.toLocaleString()}
            icon={<CarIcon size={20} stroke={isDarkMode ? '#fff' : '#2563eb'} />}
            subtitle={`$${(
              mileageStats.businessMiles * mileageStats.mileageRate
            ).toFixed(2)} Deduction`}
          />
          <StatCard
            title="Per Mile"
            value="$0.32"
            icon={<WrenchIcon size={20} stroke={isDarkMode ? '#fff' : '#2563eb'} />}
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
            <Text className="text-sm text-blue-600">View All</Text>
          </View>
          {recentExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              id={expense.id}
              date={expense.date}
              category={expense.category}
              description={expense.description}
              amount={expense.amount}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </View>
      </ScrollView>

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
          expense={selectedExpense}
          onSave={handleSave}
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
              Are you sure you want to delete this expense? This action cannot
              be undone.
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