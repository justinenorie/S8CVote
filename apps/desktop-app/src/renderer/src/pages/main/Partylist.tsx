import { useState, useEffect } from "react";
import { toast } from "sonner";

import Typography from "@renderer/components/ui/Typography";
import { DataTable } from "@renderer/components/ui/DataTable";
import { usePartylistColumns } from "@renderer/components/partylist/column";
import { Partylist } from "@renderer/types/api";
import { AddPartylistModal } from "@renderer/components/partylist/AddPartylistModal";
import { EditPartylistModal } from "@renderer/components/partylist/EditPartylistModal";
import { ConfirmDialog } from "@renderer/components/ui/ConfirmDialog";

import { usePartylistStore } from "@renderer/stores/usePartylistStore";

const Partylists = (): React.ReactElement => {
  const { loading, partylist, fetchPartylist, deletePartylist } =
    usePartylistStore();

  const [selectedPartylist, setSelectedPartylist] = useState<Partylist | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const columns = usePartylistColumns({
    onEdit: (partylist) => {
      setSelectedPartylist(partylist);
      setEditModalOpen(true);
    },
    onDelete: (partylist) => {
      setSelectedPartylist(partylist);
      setDeleteModalOpen(true);
    },
  });

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      await fetchPartylist();
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (): Promise<void> => {
    if (!selectedPartylist) return;

    const result = await deletePartylist(selectedPartylist.id);

    if (result.error) {
      toast.error(`❌ Failed to delete: ${result.error}`);
    } else {
      toast.success("Delete SuccessFull!", {
        description: `✅ ${selectedPartylist.partylist} deleted successfully..`,
      });
    }

    setDeleteModalOpen(false);
    setSelectedPartylist(null);
  };

  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Partylist
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Manage and verify partylists to ensure accurate election data
        </Typography>
      </header>

      <DataTable
        columns={columns}
        data={partylist}
        searchPlaceholder="Search Partylist...."
        addButtonLabel="Add New Partylist"
        addModal={AddPartylistModal}
        defaultSorting={[{ id: "partylist", desc: false }]}
      />

      <EditPartylistModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPartylist(null);
        }}
        selectedPartylist={selectedPartylist}
      />

      <ConfirmDialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={loading}
        title={`Are you sure to delete ${selectedPartylist?.partylist ?? ""}?`}
        description=" This action cannot be undone. All values associated with this field will be lost."
        confirmLabel="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
};

export default Partylists;
