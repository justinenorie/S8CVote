import * as React from "react";
import Typography from "../ui/Typography";

type Candidate = {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  image?: string | null;
};

interface ElectionCardProps {
  electionId: string;
  electionTitle: string;
  candidates: Candidate[];
}

const getOrdinalNumber = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

const ElectionsCard = ({
  electionTitle,
  candidates,
}: ElectionCardProps): React.JSX.Element => {
  // const { loadElections } = useVoteStore();

  return (
    <div className="bg-PRIMARY-50 dark:bg-PRIMARY-950 dark:border-PRIMARY-700 w-full rounded-2xl p-4 shadow-md dark:border-1">
      <Typography variant="h4" className="mb-3 font-semibold">
        {electionTitle}
      </Typography>

      <div className="space-y-4">
        {candidates.map((cand, index) => {
          const isFirstRunnerUp = index === 0;
          return (
            <div
              key={cand.id}
              className={`hover:bg-muted/30 border/50 rounded-md p-3 shadow-md transition ${
                isFirstRunnerUp
                  ? "bg-SUCCESSlight/20 border-SUCCESSlight/40 border-1"
                  : "bg-muted/20"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <Typography variant="p" className="font-medium">
                  {getOrdinalNumber(index + 1)} {cand.name}
                </Typography>
                <span className="text-sm font-semibold">
                  {cand.percentage.toFixed(2)}%
                </span>
              </div>

              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-semibold text-teal-600">
                  {cand.votes} Votes
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-teal-500"
                  style={{ width: `${cand.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectionsCard;
