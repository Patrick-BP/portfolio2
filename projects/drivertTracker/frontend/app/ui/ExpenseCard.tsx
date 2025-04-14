import React from 'react'
import { Trash2, Pencil } from 'lucide-react-native'
import { useTheme } from '../contexts/ThemeContext'
import { View, Text, TouchableOpacity } from 'react-native'

interface ExpenseCardProps {
  id: string
  date: string
  category: string
  description: string
  amount: number
  gallons?: number
  odometer?: number
  previousOdometer?: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}
const ExpenseCard = ({
  id,
  date,
  category,
  description,
  amount,
  gallons,
  odometer,
  previousOdometer,
  onEdit,
  onDelete,
}: ExpenseCardProps) => {
  const { isDarkMode } = useTheme()
  // Calculate metrics for fuel expenses
  const tripDistance =
    odometer && previousOdometer
      ? Math.max(0, odometer - previousOdometer)
      : null
  const mpg =
    tripDistance && gallons ? (tripDistance / gallons).toFixed(1) : null
  const pricePerGallon = gallons ? (amount / gallons).toFixed(3) : null
  return (
    <View className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 mb-3`}
    >
      <View className="flex-row justify-between items-start">
        <View className="">
          <View className="flex-row items-center">
            <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {date}
            </Text>
            <Text className={`ml-2 px-2 py-1 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'} rounded-full text-xs`}>
              {category}
            </Text>
          </View>
          <Text className={`font-medium mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`} >
            {description}
          </Text>
          {category === 'Fuel' && gallons && (
            <View  className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} >
              <Text>
                {gallons.toFixed(3)} gallons at ${pricePerGallon}/gal
              </Text>
              {mpg && <Text>{mpg} MPG</Text>}
            </View>
          )}
        </View>
        <Text className={`font-bold text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`} >
          ${amount.toFixed(2)}
        </Text>
      </View>
      <View className="flex-row justify-end mt-3 space-x-2">
        <TouchableOpacity
          onPress={() => onEdit(id)}
          className={`p-1 mr-2 text-blue-500 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}`}
          aria-label="Edit expense"
        >
          <Pencil size={16} stroke="#2563eb"/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(id)}
          className={`p-1 text-red-500 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-red-50'}`}
          aria-label="Delete expense"
        >
          <Trash2 size={16} stroke="red"/>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default ExpenseCard
