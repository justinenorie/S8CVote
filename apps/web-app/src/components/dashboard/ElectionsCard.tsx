"use client";

import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/Typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CandidatesModal from "./CandidatesCard";
import { useVoteStore } from "@/stores/useVoteStore";

type Candidates = {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  image: string | null;
  partylist?: string | null;
  acronym?: string | null;
  color?: string | null;
};

interface ElectionCardProps {
  electionId: string;
  electionTitle: string;
  voted: boolean;
  candidates: Candidates[];
}

const getOrdinalNumber = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

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

const ElectionCard = ({
  electionId,
  electionTitle,
  voted,
  candidates,
}: ElectionCardProps) => {
  const [open, setOpen] = useState(false);

  const { loadElections } = useVoteStore();

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  return (
    <div>
      <div className="bg-card rounded-xl border p-4 shadow-md transition hover:shadow-lg">
        <Typography variant="h4" className="mb-3">
          {electionTitle}
        </Typography>

        <div className="mb-4 space-y-2">
          {candidates.map((c, index) => {
            const isFirstRunnerUp = index === 0;
            const partyColor = c.color || "#9ca3af";
            const acronym = c.acronym || "N/A";
            return (
              <div
                key={c.id}
                className={`hover:bg-muted/30 rounded-md border p-3 transition ${
                  isFirstRunnerUp
                    ? "bg-SUCCESSlight/20 border-SUCCESSlight/40 border"
                    : "bg-muted/20"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <Typography variant="small" className="">
                      {getOrdinalNumber(index + 1)}
                    </Typography>
                    <Typography variant="p">{c.name}</Typography>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold uppercase"
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
                <div className="text-muted-foreground flex flex-row items-center justify-between">
                  <Typography variant="h4">
                    {c.votes}{" "}
                    <Typography variant="small">Votes</Typography>{" "}
                  </Typography>
                  <Typography variant="p">{c.percentage}%</Typography>
                </div>
                <div className="bg-PRIMARY-100 dark:bg-PRIMARY-950 relative mt-1 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-SECONDARY-400 dark:bg-SECONDARY-200 absolute top-0 left-0 h-full transition-all"
                    style={{ width: `${c.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          className={`w-full ${voted ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={voted}
          variant={voted ? "outline" : "default"}
          onClick={() => setOpen(true)}
        >
          {voted ? "Already Voted" : "Vote Now"}
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{electionTitle}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select Candidates to vote:
            </DialogDescription>
          </DialogHeader>
          <CandidatesModal
            electionId={electionId}
            candidates={candidates}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElectionCard;
