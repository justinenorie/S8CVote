import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@renderer/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { Student } from "@renderer/types/api";

export const useStudentColumns = (): ColumnDef<Student>[] => {
  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "student_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Student ID
            {column.getIsSorted() === "asc" && <ArrowUp />}
            {column.getIsSorted() === "desc" && <ArrowDown />}
          </Button>
        );
      },
    },
    {
      accessorKey: "fullname",
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
      cell: ({ row }) => <div className="p-2">{row.getValue("email")}</div>,
    },
    {
      // Status Filtering
      accessorKey: "isRegistered",
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
              <DropdownMenuItem onClick={() => column.setFilterValue("1")}>
                Registered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue("0")}>
                Not Registered
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
              status === 1 ? "font-semibold text-green-600" : "text-gray-500"
            }
          >
            {status === 1 ? "Registered" : "Not Registered"}
          </span>
        );
      },
    },
  ];

  return [...columns];
};
