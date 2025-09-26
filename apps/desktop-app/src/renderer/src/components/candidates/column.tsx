import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@renderer/components/ui/dropdown-menu";
import { Delete, SquarePen } from "lucide-react";
import { Candidates } from "@renderer/types/api";

export const useCandidatesColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (candidates: Candidates) => void;
  onDelete: (candidates: Candidates) => void;
}): ColumnDef<Candidates>[] => {
  const columns: ColumnDef<Candidates>[] = [
    {
      accessorKey: "profile",
      header: "Profiles",
    },
    {
      accessorKey: "name",
      header: "Names",
    },
    {
      accessorKey: "election",
      header: "Election",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <span
            className={
              status === "Open"
                ? "font-semibold text-green-600"
                : "text-gray-500"
            }
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-TEXTdark/40 hover:text-TEXTdark/80 dark:text-TEXTlight/80 dark:hover:text-TEXTlight px-2"
            >
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-PRIMARY-50 dark:bg-PRIMARY-950 text-TEXTdark/80 dark:text-TEXTlight/80">
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
              className="justify-between"
            >
              Edit <SquarePen />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original)}
              variant="destructive"
              className="justify-between"
            >
              Delete <Delete />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return [...columns];
};
