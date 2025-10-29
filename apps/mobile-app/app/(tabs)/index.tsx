import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { ElectionCard } from "@/components/dashboard/ElectionCard";
import { useVoteStore } from "@/store/useVoteStore";

export default function Dashboard() {
  const { elections, loadElections, error, lastUpdated } = useVoteStore();

  useEffect(() => {
    loadElections();
  }, [loadElections, lastUpdated]);

  return (
    <ScrollView className="py-10 px-3 bg-BGlight dark:bg-BGdark">
      <Text
        className="text-TEXTdark dark:text-TEXTlight text-left"
        variant="h1"
      >
        Active Elections
      </Text>
      <Text
        variant="p"
        className="text-TEXTdark dark:text-TEXTlight text-left "
      >
        Click on an election to cast your vote.
      </Text>

      {error && (
        <Text variant="p" className="text-red-500">
          {error}
        </Text>
      )}

      <View className="mt-3 mb-10">
        {elections.map((elec) => (
          <ElectionCard
            key={elec.id}
            elections={elec}
            id={elec.id}
            title={elec.title}
            has_voted={elec.has_voted}
            candidates={elec.candidates.map((candi) => ({
              candidate_id: candi.candidate_id,
              candidate_name: candi.candidate_name,
              votes_count: candi.votes_count,
              percentage: candi.percentage,
              candidate_profile: candi.candidate_profile ?? null,
              partylist_id: candi.partylist_id,
              partylist_name: candi.partylist_name,
              partylist_acronym: candi.partylist_acronym,
              partylist_color: candi.partylist_color,
            }))}
          />
        ))}
      </View>
    </ScrollView>
  );
}
