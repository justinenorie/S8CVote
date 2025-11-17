import { Text } from "@/components/ui/text";
import { Candidate, Election } from "@/types/api";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "../ui/button";
import { CandidateCard } from "./CandidateCard";
import FullCandidatesList from "./FullCandidatesList";
import { VotingModal } from "./VotingModal";

interface ElectionCardProps {
  id: string;
  title: string;
  has_voted: boolean;
  candidates: Candidate[];
  elections: Election;
}

const getOrdinalNumber = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export function ElectionCard({
  id,
  title,
  has_voted,
  candidates,
  elections,
}: ElectionCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);

  return (
    <View className="bg-PRIMARY50 dark:bg-PRIMARY900 rounded-xl p-4 mb-4 shadow-md border border-border">
      <Text variant="h3" className="mb-3 text-TEXTdark dark:text-TEXTlight">
        {title}
      </Text>

      {candidates.slice(0, 5).map((candidate: Candidate, index: number) => (
        <CandidateCard
          key={candidate.candidate_id}
          rank={getOrdinalNumber(index + 1)}
          name={candidate.candidate_name}
          votes={candidate.votes_count}
          percentage={candidate.percentage}
          isWinner={index === 0}
          acronym={candidate.partylist_acronym}
          color={candidate.partylist_color}
        />
      ))}

      <Button
        variant="default"
        disabled={has_voted}
        onPress={() => setModalVisible(true)}
        className="mt-3 dark:bg-PRIMARY50 bg-PRIMARY900"
      >
        <Text variant="h4" className="font-poppins-bold">
          {has_voted ? "Voted" : "Vote Now"}
        </Text>
      </Button>

      {candidates.length > 5 && (
        <Button
          variant="ghost"
          onPress={() => setViewAllOpen(true)}
          className="text-foreground/80 mt-2 w-full text-sm"
        >
          <Text variant="h4" className="">
            View all candidates
          </Text>
        </Button>
      )}

      <VotingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        election={elections}
      />

      <FullCandidatesList
        visible={viewAllOpen}
        onClose={() => setViewAllOpen(false)}
        title={title}
        candidates={candidates.map((c) => ({
          id: c.candidate_id,
          name: c.candidate_name,
          votes: c.votes_count,
          percentage: c.percentage,
          partylist: c.partylist_name ?? null,
          acronym: c.partylist_acronym ?? null,
          color: c.partylist_color ?? null,
        }))}
      />
    </View>
  );
}
