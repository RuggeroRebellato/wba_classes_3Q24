import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Wallet() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Wallet Screen</Text>
      <Link href="/">Go back home</Link>
    </View>
  );
}
