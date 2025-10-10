import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  getSortedRowModel,
  getPaginationRowModel,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  addButtonLabel?: string;
  isLoading?: boolean;
  addModal?: React.ComponentType<{
    open: boolean;
    onClose: () => void;
  }>;
  defaultSorting?: SortingState;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder,
  addButtonLabel,
  isLoading,
  addModal: AddModal,
  defaultSorting = [],
}: DataTableProps<TData, TValue>): React.ReactElement {
  const [filter, setFilter] = React.useState("");

  const [sorting, setSorting] = React.useState<SortingState>(defaultSorting);

  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [filter]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filter,
      sorting,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

        {AddModal && (
          <>
            <Button
              variant="default"
              onClick={() => setAddModalOpen(true)}
              className="cursor-pointer"
            >
              <Plus />
              <Typography variant="small">
                {addButtonLabel ?? "Add New"}
              </Typography>
            </Button>
            <AddModal
              open={addModalOpen}
              onClose={() => setAddModalOpen(false)}
            />
          </>
        )}
      </div>

      {/* 📊 Table */}
      <div className="overflow-hidden rounded-lg">
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
                  {isLoading ? (
                    <Typography variant="small">Loading...</Typography>
                  ) : (
                    <Typography variant="small">No results.</Typography>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="relative flex w-full items-center justify-between px-2">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredRowModel().rows.length} row(s).
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
