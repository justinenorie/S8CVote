import { StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  return (
    <ScrollView className="p-5">
      <Text className="text-PRIMARY400 text-left" variant="h1">
        This is me
      </Text>
      <Text className="text-PRIMARY400 text-left" variant="h2">
        This is me
      </Text>
      <Text className="text-PRIMARY400 text-left" variant="h3">
        This is me
      </Text>
      <Text className="text-PRIMARY400 text-left" variant="h4">
        This is me
      </Text>
      <Text className="text-PRIMARY400 text-left" variant="p">
        This is me
      </Text>
      <Text className="text-PRIMARY400 text-left" variant="small">
        This is me
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
