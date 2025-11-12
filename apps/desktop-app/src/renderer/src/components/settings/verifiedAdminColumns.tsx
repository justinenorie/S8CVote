import { ColumnDef } from "@tanstack/react-table";
import { Admin } from "@renderer/stores/useAdminStore";

export const useVerifiedAdminsColumns = (): ColumnDef<Admin>[] => [
  { accessorKey: "fullname", header: "Full Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "approved_at", header: "Approved At" },
];
