import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import YearsSelectionPeriod from "@/components/results/YearsSelectionPeriod";
import ResultsCard from "@/components/results/ResultsCard";
import { useResultsStore } from "@/store/useResultsStore";

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
      <View className="flex flex-row justify-between items-center mb-6">
        <Text variant="h1" className="text-TEXTdark dark:text-TEXTlight">
          Election Results
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
