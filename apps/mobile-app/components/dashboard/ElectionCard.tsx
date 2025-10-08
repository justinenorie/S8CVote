import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "../ui/button";
import { CandidateCard } from "./CandidateCard";

export function ElectionCard({ title, voted, candidates }: any) {
  return (
    <View className="bg-PRIMARY50 dark:bg-PRIMARY900 rounded-xl p-4 mb-4 shadow-md border border-border">
      <Text variant="h3" className="mb-3 text-TEXTdark dark:text-TEXTlight">
        {title}
      </Text>

      {/* TODO: Add a proper type here */}
      {candidates.map((candidate: any, index: number) => (
        <CandidateCard
          key={candidate.id}
          rank={`${index + 1}${index === 0 ? "st" : index === 1 ? "nd" : "th"}`}
          name={candidate.name}
          votes={candidate.votes}
          percentage={candidate.percentage}
          isWinner={index === 0}
        />
      ))}

      <Button
        variant="default"
        disabled={voted}
        className="mt-3 dark:bg-PRIMARY50 bg-PRIMARY900"
      >
        <Text variant="h4" className="font-poppins-bold">
          {voted ? "Voted" : "Vote Now"}
        </Text>
      </Button>
    </View>
  );
}
