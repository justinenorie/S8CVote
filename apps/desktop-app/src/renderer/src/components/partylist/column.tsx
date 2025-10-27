import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@renderer/components/ui/dropdown-menu";
import { ArrowDown, ArrowUp, Delete, SquarePen } from "lucide-react";
import { Partylist } from "@renderer/types/api";

export const usePartylistColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (candidates: Partylist) => void;
  onDelete: (candidates: Partylist) => void;
}): ColumnDef<Partylist>[] => {
  const columns: ColumnDef<Partylist>[] = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const partylist = row.getValue("partylist") as string;
        const url = row.getValue("logo") as string;
        return (
          <div>
            {url ? (
              <img
                src={url}
                alt={`${partylist} Logos`}
                className="h-15 w-15 rounded-full object-cover"
              />
            ) : (
              <div className="dark:bg-PRIMARY-200/80 bg-PRIMARY-900/80 h-15 w-15 rounded-full" />
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "partylist",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Partylist
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
    {
      accessorKey: "acronym",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Acronym
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
    // TODO: Add a total votes results here for transparency
    {
      accessorKey: "color",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Color
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
    {
      accessorKey: "members_count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1 text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Members
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
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
