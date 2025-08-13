import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
    return(
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#007AFF',
            headerShown: false,
          }}
          initialRouteName="home">
            <Tabs.Screen
            name="home"
            options={{
            title: 'ホーム',
            tabBarIcon: ({ color }: { color: string }) => (
                <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'ライブラリ',
          tabBarIcon: ({ color }: { color: string }) => (
            <Ionicons name="library" size={24} color={color} />
          ),
        }}
      />

        </Tabs>
    )
}