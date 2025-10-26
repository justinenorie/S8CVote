import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./../global.css";
import { PortalHost } from "@rn-primitives/portal";
import Toast from "react-native-toast-message";

import { ThemeProvider } from "@/components/ThemeProvider";
import toastConfig from "@/components/toastConfig";
// state imports
import { useAuthStore } from "@/store/useAuthStore";

// local db imports
import { db, expo_sqlite } from "@/db/client";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/db/drizzle/migrations";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

// // autosync imports
// import { AppState } from "react-native";
// import { isOnline } from "@/utils/network";
// import {
//   syncElectionsAndCandidates,
//   syncStudentsFromSupabase,
//   syncVotesToSupabase,
// } from "@/db/queries/syncQuery";
import { useAppSync } from "@/hooks/useAppSync";

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

  const { session, loadSession } = useAuthStore();
  // const [dbReady, setDbReady] = useState(false);

  // // listner to check if online
  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", async (state) => {
  //     if (state === "active") {
  //       const online = await isOnline();
  //       if (online) {
  //         console.log("🔄 App active & online — syncing pending data...");
  //         await Promise.all([
  //           syncElectionsAndCandidates(),
  //           syncStudentsFromSupabase(),
  //           syncVotesToSupabase(),
  //         ]);
  //       } else {
  //         console.log("📴 Offline mode detected");
  //       }
  //     }
  //   });

  //   // Cleanup when layout unmounts
  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    if (error) throw error;
    if (migrationError) throw migrationError;
  }, [error, migrationError]);

  useEffect(() => {
    loadSession(); // check auth state on app start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync
  useAppSync();

  if (!loaded || !success) {
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
