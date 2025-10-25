import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "../ui/button";
import { CandidateCard } from "./CandidateCard";
import { VotingModal } from "./VotingModal";
import { Candidate, Election } from "@/types/api";

export function ElectionCard({
  id,
  title,
  has_voted,
  candidates,
  elections,
}: Election) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="bg-PRIMARY50 dark:bg-PRIMARY900 rounded-xl p-4 mb-4 shadow-md border border-border">
      <Text variant="h3" className="mb-3 text-TEXTdark dark:text-TEXTlight">
        {title}
      </Text>

      {/* TODO: Add a proper type here */}
      {candidates.map((candidate: Candidate, index: number) => (
        <CandidateCard
          key={candidate.candidate_id}
          rank={`${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "th"}`}
          name={candidate.candidate_name}
          votes={candidate.votes_count}
          percentage={candidate.percentage}
          isWinner={index === 0}
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

      <VotingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        election={elections}
      />
    </View>
  );
}
