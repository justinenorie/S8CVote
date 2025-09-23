import { Button } from "@renderer/components/ui/Button";
import Typography from "./Typography";
import { TriangleAlert } from "lucide-react";

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}): React.ReactElement | null {
  if (!open) return null;

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-PRIMARY-50 dark:bg-PRIMARY-900 grid w-[380px] justify-items-center gap-4 rounded-xl p-6 text-center">
        <TriangleAlert className="text-ERRORlight h-15 w-15" />

        <div>
          <Typography variant="h3" className="font-bold">
            Are you sure to delete {itemName}?
          </Typography>
          <Typography variant="p">
            This action cannot be undone. All values associated with this field
            will be lost.
          </Typography>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="bg-PRIMARY-50 dark:bg-PRIMARY-900/50 dark:hover:bg-PRIMARY-800 hover:dark:text-TEXTlight border-BGdark/20 w-full"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button variant="destructive" className="w-full" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
