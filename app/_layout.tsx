import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'index', headerShown: false }} />
      <Stack.Screen name="indoor" options={{ title: 'indoor', headerShown: false }} />
      <Stack.Screen name="maps" options={{ title: 'maps', headerShown: false }} />
    </Stack>
  );
}
