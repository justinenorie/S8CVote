"use client";

import { useEffect } from "react";
import Typography from "@/components/ui/Typography";
import ElectionsCard from "@/components/dashboard/ElectionsCard";
import { useVoteStore } from "@/stores/useVoteStore";

export default function DashboardElectionList() {
  const { elections, loadElections, loading, error } = useVoteStore();

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  // TODO: add a skeleton loading here later on
  return (
    <div>
      {loading && <Typography variant="p">Loading…</Typography>}
      {error && (
        <Typography variant="p" className="text-red-500">
          {error}
        </Typography>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {elections.map((elec) => (
          <ElectionsCard
            key={elec.id}
            electionId={elec.id}
            electionTitle={elec.title}
            voted={elec.has_voted}
            candidates={elec.candidates.map((candi) => ({
              id: candi.candidate_id,
              name: candi.candidate_name,
              votes: candi.votes_count,
              percentage: candi.percentage,
              image: candi.candidate_profile ?? null,
            }))}
          />
        ))}
      </div>
    </div>
  );
}
