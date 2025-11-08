"use client";

import { useState, useEffect } from "react";
import LoadingElections from "./LoadingElections";
import Typography from "../ui/Typography";
import ElectionsCard from "@/components/dashboard/ElectionsCard";
import { useVoteStore } from "@/stores/useVoteStore";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export default function DashboardElectionList() {
  const { elections, loadElections, error } = useVoteStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadElections();
    setTimeout(() => setIsLoading(false), 1000);
  }, [loadElections]);

  useRealtimeSync();

  return (
    <div>
      {error && (
        <Typography variant="p" className="text-red-500">
          {error}
        </Typography>
      )}

      {isLoading ? (
        <LoadingElections />
      ) : (
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {elections.map((elec) => (
            <div key={elec.id} className="mb-6 break-inside-avoid">
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
                  description: candi.description ?? null,
                  partylist: candi.partylist_name,
                  acronym: candi.partylist_acronym,
                  color: candi.partylist_color,
                }))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
