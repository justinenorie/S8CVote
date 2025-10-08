import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { LayoutDashboard, ChartGantt } from "lucide-react-native";
import { useTheme } from "@/components/ThemeProvider";
import { COLORS } from "@/constants/Colors";

export default function TabsLayout() {
  const { theme } = useTheme();

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
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Results",
          tabBarIcon: ({ color }) => <ChartGantt size={30} color={color} />,
        }}
      />
    </Tabs>
  );
}
