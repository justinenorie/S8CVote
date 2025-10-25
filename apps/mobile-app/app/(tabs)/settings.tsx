import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

export default function Settings() {
  const { signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  // TODO: Add Toast

  return (
    <ScrollView className="py-10 px-3 bg-BGlight dark:bg-BGdark">
      <View>
        <Text
          variant="h1"
          className="text-left text-TEXTdark dark:text-TEXTlight"
        >
          Settings
        </Text>
        <Button onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
