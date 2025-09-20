import { Button } from "@renderer/components/ui/Button";
import Typography from "./Typography";

// TODO: need some tweaks here the design
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[350px] rounded-xl bg-white p-6 text-center dark:bg-gray-800">
        <Typography variant="h3" className="mb-4">
          Delete {itemName}?
        </Typography>
        <Typography variant="p" className="mb-6">
          This action cannot be undone.
        </Typography>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
