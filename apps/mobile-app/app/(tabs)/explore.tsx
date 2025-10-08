import { StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import ThemeToggle from "@/components/ThemeToggle";

// import { AppWindow, Container } from "lucide-react-native";

export default function TabTwoScreen() {
  return (
    <ScrollView className="py-10 px-3 bg-BGlight dark:bg-BGdark">
      <ThemeToggle />
      <Text className="text-PRIMARY400 text-left" variant="h1">
        This is me
      </Text>
      <Text variant="h1">Hi</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
  },
});
