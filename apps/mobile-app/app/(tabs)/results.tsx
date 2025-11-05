import ResultsCard from "@/components/results/ResultsCard";
import YearsSelectionPeriod from "@/components/results/YearsSelectionPeriod";
import { Text } from "@/components/ui/text";
import { useResultsStore } from "@/store/useResultsStore";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

export default function Results() {
  const { results, loadResults } = useResultsStore();
  const todayYear = new Date().getFullYear();
  const todayYearString = todayYear.toString();
  const [selectedYear, setSelectedYear] = useState<{
    label: string;
    value: string;
  } | null>(todayYearString as unknown as { label: string; value: string });

  const years = results.map((d) => d.year);

  const selectedData = results.find(
    (y) => String(y.year) === selectedYear?.value
  );

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  return (
    <ScrollView className="py-10 px-3 bg-BGlight dark:bg-BGdark">
      <View className="flex flex-col justify-between mb-6">
        <Text
          variant="h1"
          className="text-left text-TEXTdark dark:text-TEXTlight"
        >
          Election Results
        </Text>
        <Text
          variant="p"
          className="text-left text-TEXTdark dark:text-TEXTlight"
        >
          View detailed results from the elections
        </Text>
      </View>

      <YearsSelectionPeriod
        years={years}
        selectedYear={selectedYear}
        onChangeYear={(val: any) => setSelectedYear(val)}
      />

      <ResultsCard data={selectedData} />
    </ScrollView>
  );
}
