import { Button } from "@renderer/components/ui/Button";

export function AddElectionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement | null {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[400px] rounded-xl bg-white p-6 dark:bg-gray-800">
        <h1 className="mb-4 text-lg font-semibold">Add New Election</h1>

        {/* TODO: Replace with your actual form */}
        <input
          type="text"
          placeholder="Election name"
          className="mb-4 w-full rounded border p-2 text-black"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={onClose}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
