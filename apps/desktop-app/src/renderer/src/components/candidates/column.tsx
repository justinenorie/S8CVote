import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@renderer/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@renderer/components/ui/dropdown-menu";
import { useState } from "react";

export type Election = {
  id: string;
  election: string;
  candidates: number;
  duration: string;
  status: "Active" | "Closed";
};

// Simple reusable modal for demo
const Modal = ({
  open,
  onClose,
  content,
}: {
  open: boolean;
  onClose: () => void;
  content: string;
}): React.ReactElement | null => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[300px] rounded-xl bg-white p-6 text-center dark:bg-gray-800">
        <h1 className="mb-4 text-xl font-semibold">{content}</h1>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export const useElectionColumns = (): ColumnDef<Election>[] => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleAction = (action: string): void => {
    setModalContent(action);
    setModalOpen(true);
  };

  const columns: ColumnDef<Election>[] = [
    {
      accessorKey: "election",
      header: "Elections",
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-TEXTdark/40 hover:text-TEXTdark/80 dark:text-TEXTlight/80 dark:hover:text-TEXTlight px-2"
            >
              •••
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAction("Edit Election")}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Delete Election")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Return columns + modal JSX (so we can render modal in Elections.tsx)
  return [
    ...columns,
    {
      id: "modal",
      header: () => null,
      cell: () => (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          content={modalContent}
        />
      ),
    },
  ];
};
