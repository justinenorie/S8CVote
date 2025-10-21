"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useVoteStore } from "@/stores/useVoteStore";

type Candidate = {
  id: number | string;
  name: string;
  image: string | null;
};

interface CandidatesModalProps {
  electionId: string;
  candidates: Candidate[];
  onClose: () => void;
}

// TODO: Add RHK and zod schema here

const CandidatesModal = ({
  electionId,
  candidates,
  onClose,
}: CandidatesModalProps) => {
  const [selected, setSelected] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { castVote } = useVoteStore();

  const onSubmit = async () => {
    setIsLoading(true);
    const { error } = await castVote(electionId, selected.toString());

    if (!selected) return;
    if (error) {
      toast.error(error);
    } else {
      toast.success("Vote submitted!");
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      {candidates.map((c) => (
        <div
          key={c.id}
          className="bg-card hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                // simple fallback if no image
                <div className="text-muted-foreground grid h-full w-full place-content-center text-xs">
                  N/A
                </div>
              )}
            </div>
            <Typography variant="p">{c.name}</Typography>
          </div>
          <Button
            variant={selected === c.id ? "default" : "outline"}
            onClick={() => setSelected(c.id)}
          >
            {selected === c.id ? "Selected" : "Vote"}
          </Button>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button
          type="submit"
          variant="default"
          disabled={selected === null || isLoading}
          onClick={onSubmit}
        >
          {isLoading ? (
            <div className="flex flex-row items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Submit
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CandidatesModal;
