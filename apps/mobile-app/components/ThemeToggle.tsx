import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      className="flex-row items-center justify-between px-4 py-3 rounded-lg bg-PRIMARY50 dark:bg-PRIMARY900 border border-black/5 dark:border-white/10"
    >
      <Text
        variant="p"
        className="text-TEXTdark dark:text-TEXTlight font-poppins-medium"
      >
        Theme
      </Text>

      <View
        className={`px-3 py-1 rounded-full ${
          theme === "light" ? "bg-PRIMARY500/60" : "bg-PRIMARY300/40"
        }`}
      >
        <Text className="text-TEXTdark dark:text-TEXTlight font-poppins-medium">
          {theme === "light" ? "Light" : "Dark"}
        </Text>
      </View>
    </Pressable>
  );
}
