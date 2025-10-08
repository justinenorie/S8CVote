// components/ThemeToggle.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // TODO: Change the design ThemeToggler button
  return (
    <Pressable
      onPress={toggleTheme}
      className="p-3 bg-secondary-500 rounded-md"
    >
      <Text className="text-foreground font-poppins-medium">
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </Text>
    </Pressable>
  );
}
