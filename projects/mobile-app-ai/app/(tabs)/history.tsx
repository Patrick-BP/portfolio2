import { View, Text } from 'react-native';
import { useTailwind } from 'nativewind';

export default function History() {
  const { tailwind } = useTailwind();
  return (
    <View style={tailwind('flex-1 items-center justify-center bg-white')}>
      <Text style={tailwind('text-lg font-bold')}>Expense History</Text>
      <Text>View your expense history here.</Text>
    </View>
  );
}
