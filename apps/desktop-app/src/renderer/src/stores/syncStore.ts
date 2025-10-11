// import { create } from "zustand";
// import { supabase } from "@/lib/supabase";
// import { useElectionStore } from "./electionStore";

// export const useSyncStore = create((set, get) => ({
//   isSyncing: false,
//   isOnline: navigator.onLine,
//   lastSyncTime: null,
//   syncError: null,

//   setOnline: (status) => set({ isOnline: status }),

//   syncToServer: async () => {
//     const { isOnline, isSyncing } = get();
//     if (!isOnline || isSyncing) return;

//     set({ isSyncing: true, syncError: null });

//     try {
//       const unsynced = await window.electronAPI.getUnsyncedElections();
//       if (unsynced.length === 0) {
//         set({ isSyncing: false, lastSyncTime: new Date().toISOString() });
//         return;
//       }

//       const syncedIds = [];
//       for (const election of unsynced) {
//         try {
//           if (election.deletedAt) {
//             await supabase
//               .from("elections")
//               .update({
//                 deletedAt: election.deletedAt,
//                 updatedAt: election.updatedAt,
//               })
//               .eq("id", election.id);
//           } else {
//             await supabase.from("elections").upsert({
//               id: election.id,
//               election: election.election,
//               description: election.description,
//               maxVotesAllowed: election.maxVotesAllowed,
//               status: election.status,
//               endDate: election.endDate,
//               endTime: election.endTime,
//               createdAt: election.createdAt,
//               updatedAt: election.updatedAt,
//             });
//           }
//           syncedIds.push(election.id);
//         } catch (err) {
//           console.error("Sync single election failed:", err);
//         }
//       }

//       if (syncedIds.length > 0) {
//         await window.electronAPI.markElectionsSynced(syncedIds);
//       }

//       set({
//         isSyncing: false,
//         lastSyncTime: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error("Sync error:", error);
//       set({ isSyncing: false, syncError: error.message });
//     }
//   },

//   syncFromServer: async () => {
//     const { isOnline, isSyncing } = get();
//     if (!isOnline || isSyncing) return;

//     set({ isSyncing: true });

//     try {
//       const { data, error } = await supabase
//         .from("elections")
//         .select("*")
//         .order("createdAt", { ascending: false });

//       if (error) throw error;

//       if (data && data.length > 0) {
//         // You'll add this new IPC later for bulk-upserting
//         await window.electronAPI.bulkUpsertElections(data);
//       }

//       set({
//         isSyncing: false,
//         lastSyncTime: new Date().toISOString(),
//       });
//     } catch (error) {
//       console.error("Sync from server error:", error);
//       set({ isSyncing: false, syncError: error.message });
//     }
//   },

//   fullSync: async () => {
//     await get().syncToServer();
//     await get().syncFromServer();
//   },
// }));
