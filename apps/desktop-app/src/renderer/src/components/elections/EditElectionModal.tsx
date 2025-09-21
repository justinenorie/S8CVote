import { Button } from "@renderer/components/ui/Button";
import { Election } from "@renderer/types/api";

export function EditElectionModal({
  open,
  onClose,
  election,
}: {
  open: boolean;
  onClose: () => void;
  election: Election | null;
}): React.ReactElement | null {
  if (!open || !election) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[400px] rounded-xl bg-white p-6 dark:bg-gray-800">
        <h1 className="mb-4 text-lg font-semibold">Edit {election.election}</h1>
        {/* TODO: Design the UI for this Form */}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}
