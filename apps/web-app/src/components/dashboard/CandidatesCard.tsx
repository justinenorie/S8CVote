"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useVoteStore } from "@/stores/useVoteStore";

type Candidate = {
  id: number | string;
  name: string;
  image: string | null;
  description: string | null;
  partylist?: string | null;
  acronym?: string | null;
  color?: string | null;
};

interface CandidatesModalProps {
  electionId: string;
  candidates: Candidate[];
  onClose: () => void;
}

// Calculate the background Color for contrast of text color
const getTextColor = (bgColor: string | null): string => {
  if (!bgColor) return "#000"; // default black text

  // Remove # if present
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If bright background → use dark text, else use white text
  return luminance > 0.6 ? "#000" : "#fff";
};

const CandidatesModal = ({
  electionId,
  candidates,
  onClose,
}: CandidatesModalProps) => {
  const { castVote } = useVoteStore();

  const [selected, setSelected] = useState<number | string>("");
  const selectedCandidate = candidates.find((c) => c.id === selected);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = async () => {
    if (!selected) return toast.error("Please select a candidate first.");

    setIsLoading(true);
    const { error } = await castVote(electionId, selected.toString());
    setIsLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Vote submitted!");
      onClose();
    }
  };

  return (
    <div className="flex max-h-[60vh] flex-col">
      <div className="">
        <div className="-mt-2 flex flex-row items-center gap-2 pb-2">
          <Typography variant="small" className="text-muted-foreground">
            {selected ? "Selected Candidate:" : "Select a candidate to vote:"}
          </Typography>

          {selectedCandidate && (
            <Typography variant="p" className="font-semibold">
              {selectedCandidate.name}
            </Typography>
          )}
        </div>

        <Input
          placeholder="Search candidate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {filtered.map((c) => {
          const partyColor = c.color || "#9ca3af";
          const acronym = c.partylist || "N/A";

          return (
            <Button
              key={c.id}
              className={`bg-card flex h-fit w-full items-center justify-between rounded-lg border p-3 transition ${selected === c.id ? "border-primary bg-primary/10" : "hover:bg-muted/40"}`}
              onClick={() => setSelected(c.id)}
              variant="ghost"
            >
              <div className="flex w-full flex-col justify-center gap-3">
                <div className="flex items-center justify-start gap-2">
                  {/* Image */}
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

                  <div className="flex flex-col text-left">
                    <Typography variant="p">{c.name}</Typography>
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-xs font-bold uppercase opacity-70 ${c.partylist ? "block" : "hidden"}`}
                      style={{
                        backgroundColor: partyColor,
                        color:
                          acronym === "N/A"
                            ? "#e9eefd"
                            : getTextColor(partyColor),
                        textAlign: "center",
                      }}
                    >
                      {acronym}
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      <div className="flex justify-end gap-3 pt-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button
          autoFocus
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
