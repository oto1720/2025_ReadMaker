import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import {WriteText} from './(tabs)/library';   // 1画面目
import ShowText from './(tabs)/display';     // 2画面目

export type RootStackParamList = {
  Write: undefined;
  Show: { text: string };   // ← text を渡す
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Write">
        <Stack.Screen name="Write" component={WriteText} />
        <Stack.Screen name="Show" component={ShowText} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
