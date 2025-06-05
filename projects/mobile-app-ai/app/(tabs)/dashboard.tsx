import { View, Text } from 'react-native';
import { useTailwind } from 'nativewind';

export default function Dashboard() {
  const { tailwind } = useTailwind();
  return (
    <View style={tailwind('flex-1 items-center justify-center bg-white')}>
      <Text style={tailwind('text-lg font-bold')}>Dashboard</Text>
      <Text>Expense summary will appear here.</Text>
    </View>
  );
}
