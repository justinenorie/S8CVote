import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { getTextColor } from "@/utils/getTextColor";

type CandidateProps = {
  rank: string;
  name: string;
  votes: number;
  percentage: number;
  isWinner?: boolean;
  acronym?: string | null;
  color?: string | null;
};

export function CandidateCard({
  rank,
  name,
  votes,
  percentage,
  isWinner,
  acronym,
  color,
}: CandidateProps) {
  const partyColor = color || "#9ca3af";
  const acronyms = acronym || "N/A";

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
        <Text
          className="rounded-full px-2 py-0.5 text-xs font-bold uppercase"
          style={{
            backgroundColor: partyColor,
            color: acronym === "N/A" ? "#e9eefd" : getTextColor(partyColor),
            textAlign: "center",
          }}
        >
          {acronyms}
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

      {/* Progress bar */}
      <View className="bg-PRIMARY100 dark:bg-PRIMARY950 h-2 mt-2 w-full rounded-full">
        <View
          className="bg-SECONDARY400 dark:bg-SECONDARY200 h-2 rounded-full transition-all"
          style={{
            width: `${percentage}%`,
            // backgroundColor: acronym === "N/A" ? "#00bba7" : partyColor,
          }}
        />
      </View>
    </View>
  );
}
