import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ExpenseForm from '@/app/ui/ExpenseForm'
import { useTheme } from '../contexts/ThemeContext';
// import { useNavigate } from 'react-router'

const Add = () => {
  // const navigate = useNavigate()
  const { isDarkMode } = useTheme();
  const handleSubmit = (expense: any) => {
    console.log('Expense added:', expense)
    // In a real app, you would save this to state/database
    // Navigate back to dashboard or history page
    // navigate('/history')
  }
  return (
    <View className={` flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`} >
      <Text className={`text-[24px] font-bold ml-4 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Add Expense</Text>
      <ExpenseForm onSubmit={handleSubmit} />
    </View>
  )
}

export default Add


