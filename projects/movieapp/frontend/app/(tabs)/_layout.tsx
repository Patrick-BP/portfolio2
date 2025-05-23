import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react';
import { Tabs } from 'expo-router';
import {images } from '@/constants/images';
import { icons } from '@/constants/icons';

const TabIcon = ({focused, icon, title}:any) => {
  if(focused) {
  return(
    <ImageBackground
    source={images.highlight}
    className='flex flex-row w-full flex-1 mt-4 min-w-[112px] min-h-16 justify-center items-center rounded-full overflow-hidden'
    >
      <Image source={icon} className='size-5' tintColor="#151312" />
      <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
    </ImageBackground>
  )  
}
  return(
    <View className='size-full justify-center items-center rounded-full mt-4'>    
      <Image source={icon} className='size-5' tintColor="#fff" />
    </View>
  )
}

const _layout = () => {
  return (
    <Tabs
    screenOptions={{
      tabBarShowLabel: false,
      tabBarItemStyle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      tabBarStyle:{
        backgroundColor: '#0f0D23',
        borderRadius: 50,
        marginHorizontal: 20,
        marginBottom: 36,
        height: 52,
        position: 'absolute',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#0f0d23',

      }
    }}
    >
      <Tabs.Screen name="index" options={{
         title: 'Home', 
         headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon  focused={focused} 
            icon={icons.home} 
            title={"Home"}  />
          ) 
         }} />

      
      <Tabs.Screen name="saved" options={{ 
        title: 'Saved', 
        headerShown: false ,
          tabBarIcon: ({ focused }) => (
            <TabIcon  focused={focused} 
            icon={icons.saved} 
            title={"Saved"}  />)
        
        }} />

      <Tabs.Screen name="profile" options={{ 
        title: 'Profile', 
        headerShown: false ,
        tabBarIcon: ({ focused }) => (
          <TabIcon  focused={focused} 
          icon={icons.profile} 
          title={"Profile"}  />)
        }} />
        
        <Tabs.Screen name="search" options={{ 
          title: 'Search',
          headerShown: false ,
          tabBarIcon: ({ focused }) => (
              <TabIcon  focused={focused} 
              icon={icons.search} 
              title={"Search"}  />)
          
         }} />

    </Tabs>
  )
}

export default _layout

