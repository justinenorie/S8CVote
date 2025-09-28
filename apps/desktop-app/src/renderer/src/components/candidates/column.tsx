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
      header: "Profile",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const url = row.getValue("profile") as string;
        return (
          <div>
            {url ? (
              <img
                src={url}
                alt={`${name} Profile`}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="dark:bg-PRIMARY-200/80 bg-PRIMARY-900/80 h-10 w-10 rounded-full" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
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
      accessorFn: (row) => row.election?.election,
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
              <DropdownMenuItem onClick={() => column.setFilterValue("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue("closed")}>
                Closed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      accessorFn: (row) => row.election?.status,
      cell: ({ row }) => {
        const status = row.getValue("status") as "active" | "closed";
        return (
          <span
            className={
              status === "active"
                ? "font-semibold text-green-600"
                : "text-gray-500"
            }
          >
            {status === "active" ? "Active" : "Closed"}
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
