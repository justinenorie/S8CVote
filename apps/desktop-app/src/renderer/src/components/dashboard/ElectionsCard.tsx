import * as React from "react";
import CandidatesRow from "./CandidatesRow";
import Typography from "../ui/Typography";

type Candidate = {
  name: string;
  votes: number;
};

type Category = {
  title: string;
  candidates: Candidate[];
};

const ElectionsCard = ({
  category,
}: {
  category: Category;
}): React.JSX.Element => {
  const totalVotes = category.candidates.reduce((sum, c) => sum + c.votes, 0);

  // Sort by votes (descending) and add rank + percentage
  const enrichedCandidates = [...category.candidates]
    .sort((a, b) => b.votes - a.votes)
    .map((c, index) => ({
      ...c,
      rank: index + 1,
      percentage: totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0,
    }));

  return (
    <div className="bg-PRIMARY-50 dark:bg-PRIMARY-950 dark:border-PRIMARY-700 w-full rounded-2xl p-4 shadow-md dark:border-1">
      <Typography variant="h4" className="mb-3 font-semibold">
        {category.title}
      </Typography>
      <div className="space-y-3">
        {enrichedCandidates.map((cand) => (
          <CandidatesRow key={cand.rank} candidate={cand} />
        ))}
      </div>
    </div>
  );
};

export default ElectionsCard;
