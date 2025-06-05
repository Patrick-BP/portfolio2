import { View, Text } from 'react-native';
import { useTailwind } from 'nativewind';

export default function Explore() {
  const { tailwind } = useTailwind();
  return (
    <View style={tailwind('flex-1 items-center justify-center bg-white')}>
      <Text style={tailwind('text-lg font-bold')}>Explore</Text>
      <Text>Explore page content.</Text>
    </View>
  );
}
