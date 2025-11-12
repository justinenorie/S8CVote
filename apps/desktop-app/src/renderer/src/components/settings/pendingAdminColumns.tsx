import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import { Admin } from "@renderer/stores/useAdminStore";

export const usePendingAdminsColumns = (
  onApprove: (admin: Admin) => void,
  onReject: (admin: Admin) => void
): ColumnDef<Admin>[] => [
  { accessorKey: "fullname", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "created_at", header: "Requested At" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const admin = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="default" onClick={() => onApprove(admin)}>
            Approve
          </Button>
          <Button variant="destructive" onClick={() => onReject(admin)}>
            Reject
          </Button>
        </div>
      );
    },
  },
];
