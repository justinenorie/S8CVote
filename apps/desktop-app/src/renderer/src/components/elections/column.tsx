import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@renderer/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Delete,
  SquarePen,
} from "lucide-react";

export type Election = {
  id: string;
  election: string;
  candidates: number;
  duration: string;
  status: "Open" | "Closed";
};

export const useElectionColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (election: Election) => void;
  onDelete: (election: Election) => void;
}): ColumnDef<Election>[] => {
  const columns: ColumnDef<Election>[] = [
    {
      accessorKey: "election",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Elections
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
    {
      accessorKey: "candidates",
      header: "Candidates",
    },
    {
      accessorKey: "duration",
      header: "Duration",
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                Status
                <ArrowUpDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-PRIMARY-50 dark:bg-PRIMARY-950 text-TEXTdark dark:text-TEXTlight"
            >
              {/* Filtering */}
              <DropdownMenuItem
                onClick={() => column.setFilterValue(undefined)}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue("Open")}>
                Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue("Closed")}>
                Closed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
            <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
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
