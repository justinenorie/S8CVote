import { Button } from "@renderer/components/ui/Button";
import Typography from "./Typography";
import { TriangleAlert, Loader2 } from "lucide-react";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  confirmVariant = "destructive",
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive" | "ghost";
  isLoading?: boolean;
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
            {title}
          </Typography>
          {description && <Typography variant="p">{description}</Typography>}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="default"
            className="bg-PRIMARY-50 dark:bg-PRIMARY-900/50 hover:bg-PRIMARY-200 hover:dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight border-PRIMARY-700 w-full border"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            className="w-full"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
