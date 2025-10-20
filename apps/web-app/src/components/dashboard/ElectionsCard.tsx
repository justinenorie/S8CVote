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

type Candidate = {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  image?: string;
};

interface ElectionCardProps {
  electionId: string;
  electionTitle: string;
  voted: boolean;
  candidates: Candidate[];
}

const getOrdinalNumber = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

const ElectionCard = ({
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
            return (
              <div
                key={c.id}
                className={`hover:bg-muted/30 rounded-md border p-3 transition ${
                  isFirstRunnerUp
                    ? "bg-SUCCESSlight/20 border-SUCCESSlight/40 border-1"
                    : "bg-muted/20"
                }`}
              >
                <Typography variant="p" className="font-medium">
                  {getOrdinalNumber(index + 1)} {c.name}
                </Typography>
                <div className="text-muted-foreground flex flex-row items-center justify-between">
                  <Typography variant="h4">
                    {c.votes}{" "}
                    <Typography variant="small">Votes</Typography>{" "}
                  </Typography>
                  <Typography variant="p">{c.percentage}%</Typography>
                </div>
                <div className="bg-muted relative mt-1 h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-primary absolute top-0 left-0 h-full transition-all"
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
            candidates={candidates}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElectionCard;
