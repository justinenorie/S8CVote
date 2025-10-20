"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import Image from "next/image";

type Candidate = {
  id: number | string;
  name: string;
  image?: string;
};

interface CandidatesModalProps {
  candidates: Candidate[];
  onClose: () => void;
}

// TODO: Add RHK and zod schema here

const CandidatesModal = ({ candidates, onClose }: CandidatesModalProps) => {
  const onSubmit = () => {
    // TODO: Supabase submit value here
    console.log("Vote is now submitted");
  };

  const [selected, setSelected] = useState<number | string | null>(null);

  return (
    <div className="space-y-4">
      {candidates.map((c) => (
        <div
          key={c.id}
          className="bg-card hover:bg-muted/40 flex items-center justify-between rounded-lg border p-3 transition"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200">
              <Image
                src={c.image || ""}
                alt={c.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
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

        <Button disabled={selected === null} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CandidatesModal;
