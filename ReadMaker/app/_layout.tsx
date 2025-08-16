import { Stack } from 'expo-router';
import { AuthProvider } from '../src/contexts/AuthContext';
import { DictionaryProvider } from '../src/contexts/DictionaryContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="reader" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}