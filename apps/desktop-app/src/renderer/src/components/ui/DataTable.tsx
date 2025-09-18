import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Input } from "./input";
import { Button } from "./Button";
import { Plus, Search } from "lucide-react";
import Typography from "./Typography";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  addButtonLabel?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
  addButtonLabel,
}: DataTableProps<TData, TValue>): React.ReactElement {
  const [filter, setFilter] = React.useState("");

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "election", desc: false },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filter,
      sorting,
    },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* 🔍 Search bar */}
      <div className="flex flex-row gap-4">
        <div className="relative w-full">
          <Search className="text-TEXTdark/50 dark:text-TEXTlight/60 absolute top-0 bottom-0 left-3 my-auto h-6 w-6" />
          <Typography variant="small">
            <Input
              className="border-PRIMARY-700 dark:border-PRIMARY-400 text-TEXTdark dark:text-TEXTlight pr-4 pl-12"
              placeholder={searchPlaceholder ?? "Search..."}
              value={filter ?? ""}
              onChange={(event) => setFilter(event.target.value)}
            />
          </Typography>
        </div>

        <Button variant="default">
          <Plus />
          <Typography variant="small">{addButtonLabel ?? "Add New"}</Typography>
        </Button>
      </div>

      {/* 📊 Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-SECONDARY-50/80 dark:bg-SECONDARY-800/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-TEXTdark dark:text-TEXTlight"
                  >
                    <Typography variant="small">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </Typography>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <Typography variant="small">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Typography variant="small">No results.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
