// import { useEffect } from "react";
// import { useSyncStore } from "@renderer/stores/syncStore";

// export function useSync() {
//   const { fullSync, setOnline, syncToServer } = useSyncStore();

//   useEffect(() => {
//     // Initial sync on mount
//     fullSync();

//     const handleOnline = () => {
//       setOnline(true);
//       fullSync();
//     };

//     const handleOffline = () => setOnline(false);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     const syncInterval = setInterval(() => {
//       if (navigator.onLine) syncToServer();
//     }, 30000);

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//       clearInterval(syncInterval);
//     };
//   }, [fullSync, setOnline, syncToServer]);
// }
