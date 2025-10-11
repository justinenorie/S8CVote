import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@renderer/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { Admin } from "@renderer/types/api";

export const usePendingColumn = (): ColumnDef<Admin>[] => {
  const columns: ColumnDef<Admin>[] = [
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
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
    {
      // Status Filtering
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

              <DropdownMenuItem
                onClick={() => column.setFilterValue("Approved")}
              >
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("isRegistered");
        return (
          <span
            className={
              status === true ? "font-semibold text-green-600" : "text-gray-500"
            }
          >
            {status === true ? "Registered" : "Not Registered"}
          </span>
        );
      },
    },
  ];

  return [...columns];
};
