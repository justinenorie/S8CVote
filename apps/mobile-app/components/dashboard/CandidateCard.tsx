import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Progress } from "../ui/progress";

type CandidateProps = {
  rank: string;
  name: string;
  votes: number;
  percentage: number;
  isWinner?: boolean;
};

export function CandidateCard({
  rank,
  name,
  votes,
  percentage,
  isWinner,
}: CandidateProps) {
  return (
    <View
      className={`rounded-lg border mb-2 p-3 ${
        isWinner
          ? "bg-green-300/20 dark:bg-green-300/20 border-SUCCEEDEDlight "
          : "bg-PRIMARY50 dark:bg-PRIMARY900 border-border"
      }`}
    >
      <View className="flex-row justify-between mb-2">
        <Text variant="h4" className="ext-TEXTdark dark:text-TEXTlight">
          <Text variant="small">{rank}</Text> {name}
        </Text>
      </View>

      <View className="flex flex-row items-center justify-between ">
        <Text variant="h3" className="text-TEXTdark dark:text-TEXTlight">
          {votes}{" "}
          <Text variant="p" className="leading-1">
            Votes
          </Text>
        </Text>

        <Text variant="small" className="text-TEXTdark dark:text-TEXTlight">
          {percentage}%
        </Text>
      </View>

      <Progress
        value={percentage}
        className="h-2 mt-2 bg-PRIMARY100 dark:bg-PRIMARY950"
        indicatorClassName="bg-SECONDARY400 dark:bg-SECONDARY200"
      />
    </View>
  );
}
