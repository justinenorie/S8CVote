import { useTheme } from "@/components/ThemeProvider";
import { COLORS } from "@/constants/Colors";
import { useAppSync } from "@/hooks/useAppSync";
import { useAuthStore } from "@/store/useAuthStore";
import { Redirect, Tabs } from "expo-router";
import { ChartGantt, LayoutDashboard, Settings } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";

export default function TabsLayout() {
  const { theme } = useTheme();
  const { session, loading } = useAuthStore();

  useAppSync();

  if (loading) return null;
  if (!session) return <Redirect href="/(auth)" />;

  const isDark = theme === "dark";
  const backgroundColor = isDark ? COLORS.PRIMARY[950] : COLORS.PRIMARY[50];
  const activeColor = isDark ? COLORS.PRIMARY[200] : COLORS.PRIMARY[500];
  const inactiveColor = isDark
    ? "rgba(156, 163, 160, 0.8)"
    : "rgba(107, 114, 96, 0.8)";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#1f2937" : "#d1d5db",
          position: Platform.OS === "ios" ? "absolute" : "relative",
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontFamily: "Inter-Bold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }: { color: string }) => (
            <LayoutDashboard size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: "Results",
          tabBarIcon: ({ color }: { color: string }) => (
            <ChartGantt size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }: { color: string }) => (
            <Settings size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
