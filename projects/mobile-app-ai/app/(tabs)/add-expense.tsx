import { View, Text } from 'react-native';
import { useTailwind } from 'nativewind';

export default function AddExpense() {
  const { tailwind } = useTailwind();
  return (
    <View style={tailwind('flex-1 items-center justify-center bg-white')}>
      <Text style={tailwind('text-lg font-bold')}>Add Expense</Text>
      <Text>Add new fuel, maintenance, insurance, or toll expense.</Text>
    </View>
  );
}
