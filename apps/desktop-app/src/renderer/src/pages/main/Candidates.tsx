import { useState } from "react";
import Typography from "@renderer/components/ui/Typography";
import { useCandidatesColumns } from "@renderer/components/candidates/column";
import { DataTable } from "@renderer/components/ui/DataTable";
import { Candidates } from "@renderer/types/api";

// TODO: Change this. This is Temporary
import { EditElectionModal } from "@renderer/components/elections/EditElectionModal";
import { ConfirmDeleteModal } from "@renderer/components/ui/ConfirmDeleteModal";
import { AddElectionModal } from "@renderer/components/elections/AddElectionModal";

const sampleData: Candidates[] = [
  {
    profile: "https://avatars.githubusercontent.com/u/123456?v=4",
    name: "John Doe",
    election: "President",
    description: "A very nice person",
  },
  {
    profile: "https://avatars.githubusercontent.com/u/789012?v=4",
    name: "Jane Doe",
    election: "Vice President",
    description: "A very nice person too",
  },
];

const CandidatesPage = (): React.JSX.Element => {
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

  // TODO: Use Effect to fetch data here
  // useEffect(() => { }, []);

  // TODO: Handle Deletes here
  const handleDelete = async (): Promise<void> => {};

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
        data={sampleData}
        searchPlaceholder="Search Candidates...."
        addButtonLabel="Add New Candidates"
        addModal={AddElectionModal}
      />

      {/* TODO: Change this into Candidates Modal */}
      {/* <EditElectionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        election={selectedCandidates}
      /> */}

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        // isLoading={loading}
        itemName={selectedCandidates?.name ?? ""}
      />
    </div>
  );
};

export default CandidatesPage;
