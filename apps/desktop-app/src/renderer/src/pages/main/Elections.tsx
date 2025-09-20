import { useState, useEffect } from "react";
import Typography from "@renderer/components/ui/Typography";
import { DataTable } from "@renderer/components/ui/DataTable";
import { useElectionColumns } from "@renderer/components/elections/column";
import { EditElectionModal } from "@renderer/components/elections/EditElectionModal";
import { ConfirmDeleteModal } from "@renderer/components/ui/ConfirmDeleteModal";
import { AddElectionModal } from "@renderer/components/elections/AddElectionModal";
import { Election } from "@renderer/types/api";

// const elections: Election[] = [
//   {
//     id: "1",
//     election: "aPresident",
//     candidates: 1,
//     duration: "13 Days",
//     status: "Open",
//   },
//   {
//     id: "2",
//     election: "bPresident",
//     candidates: 3,
//     duration: "Done",
//     status: "Closed",
//   },
//   {
//     id: "3",
//     election: "cPresident",
//     candidates: 4,
//     duration: "3 Days",
//     status: "Open",
//   },
//   {
//     id: "4",
//     election: "AdPresident",
//     candidates: 5,
//     duration: "14 hrs",
//     status: "Open",
//   },
//   {
//     id: "5",
//     election: "President",
//     candidates: 10,
//     duration: "Done",
//     status: "Closed",
//   },
//   {
//     id: "6",
//     election: "President",
//     candidates: 10,
//     duration: "Done",
//     status: "Closed",
//   },
//   {
//     id: "7",
//     election: "President",
//     candidates: 10,
//     duration: "Done",
//     status: "Closed",
//   },
//   {
//     id: "8",
//     election: "President",
//     candidates: 10,
//     duration: "Done",
//     status: "Closed",
//   },
//   {
//     id: "8",
//     election: "V",
//     candidates: 10,
//     duration: "Done",
//     status: "Closed",
//   },
// ];

const Elections = (): React.JSX.Element => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );

  const columns = useElectionColumns({
    onEdit: (election) => {
      setSelectedElection(election);
      setEditModalOpen(true);
    },
    onDelete: (election) => {
      setSelectedElection(election);
      setDeleteModalOpen(true);
    },
  });

  useEffect(() => {
    const fetchElections = async (): Promise<void> => {
      try {
        setLoading(true);
        const res = await window.api.getElections(); // ✅ ElectionResponse
        if (res.success && res.data) {
          setElections(res.data);
        } else {
          console.error("Failed to fetch elections:", res.message);
        }
      } catch (error) {
        console.error("Error fetching elections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Elections
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Managing and Tracking Elections
        </Typography>
      </header>

      {/* 📊 DataTable */}
      {loading ? (
        <p>Loading elections...</p>
      ) : (
        <DataTable
          columns={columns}
          data={elections}
          searchPlaceholder="Search Elections..."
          addButtonLabel="Add New Election"
          addModal={AddElectionModal}
        />
      )}

      <EditElectionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        election={selectedElection}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          // TODO: handle delete
          setDeleteModalOpen(false);
        }}
        itemName={selectedElection?.election ?? ""}
      />
    </div>
  );
};

export default Elections;
