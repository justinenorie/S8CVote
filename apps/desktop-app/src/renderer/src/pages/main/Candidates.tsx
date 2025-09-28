import { useState, useEffect } from "react";
import Typography from "@renderer/components/ui/Typography";
import { useCandidatesColumns } from "@renderer/components/candidates/column";
import { DataTable } from "@renderer/components/ui/DataTable";
import { EditCandidatesModal } from "@renderer/components/candidates/EditCandidatesModal";
import { ConfirmDialog } from "@renderer/components/ui/ConfirmDialog";
import { AddCandidatesModal } from "@renderer/components/candidates/AddCandidatesModal";
import { toast } from "sonner";

import { useCandidateStore } from "@renderer/stores/useCandidateStore";
import { Candidates } from "@renderer/types/api";

// TODO: Remove this later
// const sampleData: Candidates[] = [
//   {
//     id: "1",
//     profile:
//       "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
//     name: "John Doe",
//     election: {
//       id: "1",
//       election: "President",
//       status: "active",
//     },
//     description: "A very nice person",
//   },
//   {
//     id: "2",
//     profile:
//       "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
//     name: "Jane Doe",
//     election: {
//       id: "2",
//       election: "Vice President",
//       status: "active",
//     },
//     description: "A very nice person too",
//   },
// ];

const CandidatesPage = (): React.JSX.Element => {
  // TODO: Add Loading later
  const { candidates, loading, fetchCandidates, deleteCandidate } =
    useCandidateStore();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] =
    useState<Candidates | null>(null);

  const columns = useCandidatesColumns({
    onEdit: (candidates) => {
      setSelectedCandidates(candidates);
      setEditModalOpen(true);
    },
    onDelete: (candidates) => {
      setSelectedCandidates(candidates);
      setDeleteModalOpen(true);
    },
  });

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (): Promise<void> => {
    if (!selectedCandidates) return;

    const result = await deleteCandidate(selectedCandidates.id);

    if (result.error) {
      toast.error(`❌ Failed to delete: ${result.error}`);
    } else {
      toast.success("Delete SuccessFull!", {
        description: `✅ ${selectedCandidates.name} deleted successfully..`,
      });
    }

    setDeleteModalOpen(false);
    setSelectedCandidates(null);
  };

  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Candidates
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Keep track of candidates and update their details as needed
        </Typography>
      </header>

      {/* <DataTable /> */}
      <DataTable
        columns={columns}
        data={candidates}
        isLoading={loading}
        searchPlaceholder="Search Candidates...."
        addButtonLabel="Add New Candidates"
        addModal={AddCandidatesModal}
        defaultSorting={[{ id: "name", desc: false }]}
      />

      {/* TODO: Change this into Candidates Modal */}
      <EditCandidatesModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        candidates={selectedCandidates}
      />

      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={loading}
        title={`Are you sure to delete ${selectedCandidates?.name ?? ""}?`}
        description=" This action cannot be undone. All values associated with this field will be lost."
        confirmLabel="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default CandidatesPage;
