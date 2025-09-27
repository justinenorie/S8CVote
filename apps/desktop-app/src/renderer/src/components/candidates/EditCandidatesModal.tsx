import React from "react";
import { Button } from "../ui/Button";
import { Candidates } from "@renderer/types/api";

export const EditCandidatesModal = ({
  open,
  onClose,
  candidates,
}: {
  open: boolean;
  onClose: () => void;
  candidates: Candidates | null;
}): React.ReactElement | null => {
  if (!open || !candidates) return null;

  return (
    <div
      className="bg-BGdark/30 dark:bg-BGlight/10 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <h1>{candidates?.name}</h1>
      <Button
        type="button"
        variant="default"
        className="bg-PRIMARY-50 dark:bg-PRIMARY-900/50 hover:bg-PRIMARY-200 hover:dark:bg-PRIMARY-800 text-TEXTdark dark:text-TEXTlight border-PRIMARY-700 border"
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="default"
        // disabled={loading}
        className="bg-PRIMARY-900 dark:bg-PRIMARY-200 text-TEXTlight hover:bg-PRIMARY-800 hover:dark:bg-PRIMARY-400 dark:text-TEXTdark border-PRIMARY-700 border"
      >
        {/* {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"} */}{" "}
        Submit
      </Button>
    </div>
  );
};
