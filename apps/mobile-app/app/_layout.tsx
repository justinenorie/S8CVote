import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";
import "./../global.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import toastConfig from "@/components/toastConfig";
// state imports
import { useAuthStore } from "@/store/useAuthStore";

// local db imports
import { db, expo_sqlite } from "@/db/client";
import migrations from "@/db/drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const RootLayout = () => {
  const [loaded, error] = useFonts({
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

  const { success, error: migrationError } = useMigrations(db, migrations);
  useDrizzleStudio(expo_sqlite);

  //   if (__DEV__) {
  //   useDrizzleStudio(expo_sqlite);
  // }

  const { loadSession, initialized } = useAuthStore();

  useEffect(() => {
    if (error) throw error;
    if (migrationError) throw migrationError;
  }, [error, migrationError]);

  useEffect(() => {
    if (success) {
      loadSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });

  if (!loaded || !success || !initialized) {
    // TODO: add a loading screen
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <PortalHost />
      <Toast config={toastConfig} />
    </ThemeProvider>
  );
};

export default RootLayout;
