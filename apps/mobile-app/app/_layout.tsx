import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./../global.css";
import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";

import { ThemeProvider } from "@/components/ThemeProvider";
import toastConfig from "@/components/toastConfig";
import { useAuthStore } from "@/store/useAuthStore";
import { initDB } from "@/db/client";

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter-Italic.ttf"),
  });

  const { session, loadSession } = useAuthStore();
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // ensures migrations are applied only once
        await initDB();
        setDbReady(true);
      } catch (err) {
        console.error("Migration failed", err);
      }
    })();
  }, []);

  useEffect(() => {
    loadSession(); // check auth state on app start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded || !dbReady) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        {session ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
        )}

        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="(auth)/index" options={{ headerShown: false }} /> */}

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <PortalHost />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
};

export default RootLayout;
