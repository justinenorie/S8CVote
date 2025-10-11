import { useState, useEffect } from "react";
import Typography from "@renderer/components/ui/Typography";
import { DataTable } from "@renderer/components/ui/DataTable";
import { useElectionColumns } from "@renderer/components/elections/column";
import { EditElectionModal } from "@renderer/components/elections/EditElectionModal";
import { ConfirmDialog } from "@renderer/components/ui/ConfirmDialog";
import { AddElectionModal } from "@renderer/components/elections/AddElectionModal";
import { useElectionStore } from "@renderer/stores/useElectionStore";
import { Election } from "@renderer/types/api";
import { toast } from "sonner";

const Elections = (): React.JSX.Element => {
  const { elections, loading, fetchElections, deleteElection } =
    useElectionStore();

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
    fetchElections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (): Promise<void> => {
    if (!selectedElection || !selectedElection.id) return;

    const result = await deleteElection(selectedElection.id);

    if (result.error) {
      toast.error(`❌ Failed to delete: ${result.error}`);
    } else {
      toast.success("Delete SuccessFull!", {
        description: `✅ ${selectedElection.election} deleted successfully..`,
      });
    }

    setDeleteModalOpen(false);
    setSelectedElection(null);
  };

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

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={elections}
        isLoading={loading}
        searchPlaceholder="Search Elections..."
        addButtonLabel="Add New Election"
        addModal={AddElectionModal}
        defaultSorting={[{ id: "election", desc: false }]}
      />

      <EditElectionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        election={selectedElection}
      />

      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={loading}
        title={`Are you sure to delete ${selectedElection?.election ?? ""}?`}
        description=" This action cannot be undone. All values associated with this field will be lost."
        confirmLabel="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default Elections;
