import { Stack } from "expo-router";
import './globals.css'
import { ThemeProvider } from "@/app/contexts/ThemeContext";


export default function RootLayout() {
  return (
    <ThemeProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
    </Stack>
    </ThemeProvider>
  )
}
