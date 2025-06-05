import { View, Text } from 'react-native';
import { useTailwind } from 'nativewind';

export default function NotFound() {
  const { tailwind } = useTailwind();
  return (
    <View style={tailwind('flex-1 items-center justify-center bg-white')}>
      <Text style={tailwind('text-lg font-bold')}>404 - Not Found</Text>
    </View>
  );
}
