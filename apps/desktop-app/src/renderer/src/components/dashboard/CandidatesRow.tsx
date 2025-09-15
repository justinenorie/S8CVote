import * as React from "react";

type Candidate = {
  rank: number;
  name: string;
  votes: number;
  percentage: number;
};

const getOrdinal = (n: number): string => {
  if (n >= 20 && n % 10 === 1) return `${n}st`;
  if (n >= 20 && n % 10 === 2) return `${n}nd`;
  if (n >= 20 && n % 10 === 3) return `${n}rd`;
  return `${n}th`;
};

const CandidatesRow = ({
  candidate,
}: {
  candidate: Candidate;
}): React.JSX.Element => {
  return (
    <div
      className={`dark:border-PRIMARY-700 rounded-xl p-3 shadow-sm dark:border-1 ${candidate.rank === 1 ? "bg-PRIMARY-100 dark:bg-PRIMARY-800 dark:border-PRIMARY-700 dark:border-1" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">
          {getOrdinal(candidate.rank)} {candidate.name}
        </span>
        <span className="text-sm font-semibold">
          {candidate.percentage.toFixed(2)}%
        </span>
      </div>

      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-teal-600">
          {candidate.votes} Votes
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-teal-500"
          style={{ width: `${candidate.percentage}%` }}
        />
      </div>
    </div>
  );
};

export default CandidatesRow;
