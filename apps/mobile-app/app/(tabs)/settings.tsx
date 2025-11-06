import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/store/useAuthStore";
import { useSyncStatusStore } from "@/store/useSyncStatusStore";
import { ScrollView, View } from "react-native";

export default function Settings() {
  const { adminData, signOut } = useAuthStore();
  const { online, syncing, lastSynced } = useSyncStatusStore();

  const handleSignOut = async () => await signOut();

  return (
    <ScrollView className="py-10 px-4 bg-BGlight dark:bg-BGdark">
      {/* TITLE */}
      <Text
        variant="h1"
        className="text-left text-TEXTdark dark:text-TEXTlight"
      >
        Settings
      </Text>

      {/* PROFILE CARD */}
      <View className="rounded-xl px-4 py-5 mt-2 bg-PRIMARY50 dark:bg-PRIMARY900 shadow-sm border border-black/5 dark:border-white/10">
        <Text
          variant="h3"
          className="text-center text-TEXTdark dark:text-TEXTlight"
        >
          {adminData?.fullname ?? "Admin"}
        </Text>
        <Text
          variant="p"
          className="text-center text-TEXTdark dark:text-TEXTlight"
        >
          {adminData?.email}
        </Text>
        <Text
          variant="p"
          className="text-center mt-1 text-PRIMARY600 dark:text-PRIMARY200 font-poppins-medium"
        >
          {adminData?.role?.toUpperCase()}
        </Text>
      </View>

      {/* APPEARANCE */}
      <View className="mt-4">
        <Text variant="h4" className="text-TEXTdark dark:text-TEXTlight">
          Appearance
        </Text>
        <ThemeToggle />
      </View>

      {/* SYSTEM STATUS */}
      <Text variant="h4" className="mt-4 text-TEXTdark dark:text-TEXTlight">
        System Status
      </Text>
      <View className="rounded-xl  px-4 py-5 bg-PRIMARY50 dark:bg-PRIMARY900 shadow-sm border border-black/5 dark:border-white/10">
        <Text variant="p" className="text-TEXTdark dark:text-TEXTlight">
          Connection:{" "}
          <Text className={online ? "text-green-500" : "text-red-500"}>
            {online ? "Online" : "Offline"}
          </Text>
        </Text>

        <Text variant="p" className="text-TEXTdark dark:text-TEXTlight">
          Sync:{" "}
          <Text className={syncing ? "text-yellow-500" : "text-green-500"}>
            {syncing ? "Syncing…" : "Up to date"}
          </Text>
        </Text>

        {lastSynced && (
          <Text
            variant="p"
            className="text-xs text-TEXTdark dark:text-TEXTlight"
          >
            Last synced: {new Date(lastSynced).toLocaleString()}
          </Text>
        )}
      </View>

      {/* SIGN OUT BUTTON */}
      <View className="pt-6">
        <Button onPress={handleSignOut} className="bg-primary py-3 rounded-lg">
          <Text className="dark:text-TEXTdark text-TEXTlight font-poppins-semibold text-center">
            Sign Out
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}
