import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react';
import { Tabs } from 'expo-router';
import {images } from '@/constants/images';
import { icons } from '@/constants/icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from "@/app/contexts/AuthContext";
import '../globals.css'

const TabIcon = ({focused, icon, title}:any) => {
  const { user } = useAuth();

  
  const { isDarkMode } = useTheme();
  if(focused) {
  return(
    <View className=' size-full justify-center items-center rounded-full mt-14 mb-9'>
      <Image source={icon} className='size-8 font-bold' tintColor="#2563EB" />
    </View>
  )  
}
  return(
    <View className='size-full justify-center items-center  mt-14 mb-9'>    
      <Image source={icon} className='size-8 font-bold' tintColor={isDarkMode ? '#c7d3e2' : '#151312'} />
    </View>
  )
}


const _layout = () => {
  const { isDarkMode } = useTheme();
  return (
    <Tabs
    screenOptions={{
      tabBarShowLabel: true,
      tabBarItemStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      tabBarStyle:{
        backgroundColor: isDarkMode ? '#111827' : '#fff',
        height: 80,
        overflow: 'hidden',
        width: '100%',
        borderTopWidth: 1,
        borderColor: isDarkMode ? '#394556' : '#E5E7EB',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        alignItems: 'center',
        
      },
      tabBarLabelStyle: {
       position: 'absolute',
       bottom: 15,
        fontSize: 12,
        fontWeight: '600',
        
      },
      
    }}
    >
      <Tabs.Screen name="index" options={{
         title: 'Dashboard', 
         headerShown: true,
         headerTitle: 'Dashboard',
        headerStyle: {
          backgroundColor: isDarkMode? '#1F2937' : '#1E3A8A',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 30,
        },
          tabBarIcon: ({ focused }) => (
            <TabIcon  focused={focused} 
            icon={icons.home} 
            title={"Home"}  />
          ) 
         }} />

      
      <Tabs.Screen name="addExpense" options={{ 
        title: 'Add', 
        headerShown: true,
         headerTitle: 'Add Expense',
        headerStyle: {
          backgroundColor: isDarkMode? '#1F2937' : '#1E3A8A',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 30,
        },
          tabBarIcon: ({ focused }) => (
            <TabIcon  focused={focused} 
            icon={icons.add} 
            title={"Add"}  />)
        
        }} />

      <Tabs.Screen name="history" options={{ 
        title: 'History', 
        headerShown: true,
         headerTitle: 'Expense History',
        headerStyle: {
          backgroundColor: isDarkMode? '#1F2937' : '#1E3A8A',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 30,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon  focused={focused} 
          icon={icons.history} 
          title={"History"}  />)
        }} />
        
        <Tabs.Screen name="reports" options={{ 
          title: 'Reports',
          headerShown: true,
         headerTitle: 'Reports',
        headerStyle: {
          backgroundColor: isDarkMode? '#1F2937' : '#1E3A8A',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 30,
        },
          tabBarIcon: ({ focused }) => (
              <TabIcon  focused={focused} 
              icon={icons.reports} 
              title={"Reports"}  />)
          
         }} />

        <Tabs.Screen name="settings" options={{ 
          title: 'Settings',
          headerShown: true,
         headerTitle: 'Settings',
        headerStyle: {
          backgroundColor: isDarkMode? '#1F2937' : '#1E3A8A',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 30,
        },
          tabBarIcon: ({ focused }) => (
              <TabIcon  focused={focused} 
              icon={icons.settings} 
              title={"Settings"}  />)
          
         }} />

    </Tabs>
  )
}

export default _layout

