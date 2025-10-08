import { Link, Stack } from "expo-router";
import { StyleSheet, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ScrollView style={styles.container}>
        <Text variant="h1">This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text variant="p">Go to home screen!</Text>
        </Link>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
