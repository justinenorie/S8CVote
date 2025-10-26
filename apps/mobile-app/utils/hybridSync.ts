import { isOnline } from "./network";

/**
 * hybridFetch: tries Supabase first if online,
 * otherwise falls back to SQLite (local fallback).
 */
export async function hybridSync<T>(
  onlineFetch: () => Promise<T>, // what to do if online
  offlineFetch: () => Promise<T>, // what to do if offline
  onCache?: (data: T) => Promise<void> // optional: cache update handler
): Promise<T> {
  const online = await isOnline();

  if (online) {
    try {
      const result = await onlineFetch();
      if (onCache) await onCache(result); // save to SQLite
      return result;
    } catch (err) {
      console.warn("🌐 Online fetch failed, fallback to cache:", err);
      return offlineFetch();
    }
  }

  console.log("📴 Offline mode: reading from local cache...");
  return offlineFetch();
}
