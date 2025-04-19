import { StyleSheet, Text, View, Alert, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState } from 'react'
import ExpenseForm from '@/app/ui/ExpenseForm'
import { useTheme } from '../contexts/ThemeContext'
import useRequest from '@/app/services/useRequest'
import { useRouter } from 'expo-router'

const Add = () => {
 
  const { isDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter();
  const [imageToSave, setImagetToSave] = useState()






  const handleSubmit = async (expense: any) => {

    try {
      setIsLoading(true)
      
      // Call the API to add expense
      const result = await useRequest({
        action: 'post',
        path: 'expenses',
        payload: {...expense, receipt:null}
      }).then(response =>{

        useRequest({
          action: 'patch',
          path: 'expenses',
          payload:  expense.receipt,
          id: response.data._id
        })
      }).catch(err =>{
        Alert.alert('Error', err)
        return
      })
      
      setIsLoading(false)
      
     
      

      
      // Navigate back to dashboard after successful addition
      router.push('/(tabs)/history')
    } catch (error) {
      setIsLoading(false)
      
      Alert.alert('Error', 'Failed to add expense. Please try again.')
    }
  }

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
      <Text className={`text-2xl font-bold ml-4 mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
        Add Expense
      </Text>
      
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
          <Text className={`mt-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            Adding expense...
          </Text>
        </View>
      ) : (
        <ExpenseForm onSubmit={handleSubmit} />
      )}
    </ScrollView>
  )
}

export default Add