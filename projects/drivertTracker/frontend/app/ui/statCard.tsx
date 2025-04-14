import React from 'react'
import { useTheme } from '@/app/contexts/ThemeContext';
import { View, Text } from 'react-native';
import { WrenchIcon, CalendarIcon, CarIcon } from 'lucide-react-native';

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
}
const StatCard = ({ title, value, icon, trend, subtitle }: any) => {
  const { isDarkMode } = useTheme()

  console.log(icon)
  return (
    <View className={`${isDarkMode ? 'bg-[#1F2937]' : 'bg-white'}  shadow-sm shadow-gray-900  flex flex-row items-center  p-6 mb-6 rounded-lg w-[48%]`}>
      <View className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-full p-2 mr-3`}>
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`text-[14px]  text-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          {title}
        </Text>
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`} >
          {value}
        </Text>
        {trend && (
          <Text className={`text-sm font-bold ${trend.isPositive ? 'text-green-500' : 'text-red-800'}`} >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last
            month
          </Text>
        )}
        {subtitle && (
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-800'} mt-1`} >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  )
}
export default StatCard
