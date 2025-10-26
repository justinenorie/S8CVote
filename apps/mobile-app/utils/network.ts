import * as Network from "expo-network";

export async function isOnline(): Promise<boolean> {
  try {
    const net = await Network.getNetworkStateAsync();
    // We’ll treat “connected” + “reachable” as online
    return !!net.isConnected && !!net.isInternetReachable;
  } catch {
    // Default to offline if detection fails
    return false;
  }
}
