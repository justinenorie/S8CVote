import { useEffect, useState } from "react";
import Typography from "../ui/Typography";
import { DataTable } from "../ui/DataTable";
import { useAdminsStore } from "@renderer/stores/useAdminStore";
import { usePendingAdminsColumns } from "@renderer/components/settings/pendingAdminColumns";
import { useVerifiedAdminsColumns } from "@renderer/components/settings/verifiedAdminColumns";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { toast } from "sonner";

const AdminsTab = () => {
  const {
    pendingAdmins,
    verifiedAdmins,
    loading,
    fetchAdmins,
    approveAdmin,
    rejectAdmin,
  } = useAdminsStore();

  // ✅ Local dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ✅ Handle Confirm
  const handleConfirm = async () => {
    if (!selectedAdmin || !actionType) return;

    setIsLoading(true);

    try {
      if (actionType === "approve") {
        await approveAdmin(selectedAdmin.id);
        toast.success(`${selectedAdmin.fullname} has been approved!`);
      } else {
        await rejectAdmin(selectedAdmin.id);
        toast.error(`${selectedAdmin.fullname} has been rejected.`);
      }
    } finally {
      setIsLoading(false);
      setConfirmOpen(false);
      setSelectedAdmin(null);
      setActionType(null);
    }
  };

  // ✅ Pass handlers to table columns
  const pendingColumns = usePendingAdminsColumns(
    (admin) => {
      setSelectedAdmin(admin);
      setActionType("approve");
      setConfirmOpen(true);
    },
    (admin) => {
      setSelectedAdmin(admin);
      setActionType("reject");
      setConfirmOpen(true);
    }
  );

  const verifiedColumns = useVerifiedAdminsColumns();

  return (
    <div className="space-y-10">
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <Typography variant="h4" className="mb-2">
          Pending Admins
        </Typography>
        <Typography variant="small" className="mb-4 block">
          Registration requests awaiting approval.
        </Typography>
        <DataTable
          columns={pendingColumns}
          data={pendingAdmins}
          isLoading={loading}
          searchPlaceholder="Search pending admins..."
        />
      </div>

      <div className="bg-card rounded-lg p-6 shadow-lg">
        <Typography variant="h4" className="mb-2">
          Verified Admins
        </Typography>
        <Typography variant="small" className="mb-4 block">
          Active admin accounts.
        </Typography>
        <DataTable
          columns={verifiedColumns}
          data={verifiedAdmins}
          isLoading={loading}
          searchPlaceholder="Search verified admins..."
        />
      </div>

      {/* ✅ Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={
          actionType === "approve"
            ? "Approve Admin Request"
            : "Reject Admin Request"
        }
        description={
          actionType === "approve"
            ? `Are you sure you want to approve ${selectedAdmin?.fullname}?`
            : `Are you sure you want to reject ${selectedAdmin?.fullname}?`
        }
        confirmLabel={actionType === "approve" ? "Approve" : "Reject"}
        confirmVariant={actionType === "approve" ? "default" : "destructive"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminsTab;
