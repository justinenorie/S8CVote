import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import ThemeToggle from "@/components/ThemeToggle";
import YearsSelectionPeriod from "@/components/results/YearsSelectionPeriod";
import ResultsCard from "@/components/results/ResultsCard";

const electionData = [
  {
    year: 2025,
    months: [
      {
        date: "January 2025",
        elections: [
          {
            position: "SSG President",
            totalVotes: 500,
            candidates: [
              { id: 1, name: "Ninomo Binovoto", votes: 600, percentage: 50.12 },
              { id: 2, name: "Ninomo Binovoto", votes: 600, percentage: 50.12 },
            ],
          },
          {
            position: "SSG Vice President",
            totalVotes: 400,
            candidates: [
              { id: 1, name: "Mimi Lala", votes: 250, percentage: 62.5 },
              { id: 2, name: "Toto Lino", votes: 150, percentage: 37.5 },
            ],
          },
        ],
      },
      {
        date: "March 2025",
        elections: [
          {
            position: "SSG Secretary",
            totalVotes: 320,
            candidates: [
              { id: 1, name: "Anna Dela Cruz", votes: 180, percentage: 56.25 },
              { id: 2, name: "Lino Carpio", votes: 140, percentage: 43.75 },
            ],
          },
        ],
      },
    ],
  },
  {
    year: 2026,
    months: [
      {
        date: "February 2025",
        elections: [
          {
            position: "SSG President",
            totalVotes: 500,
            candidates: [
              { id: 1, name: "Ninomo Binovoto", votes: 600, percentage: 50.12 },
              { id: 2, name: "Ninomo Binovoto", votes: 600, percentage: 50.12 },
            ],
          },
          {
            position: "SSG Vice President",
            totalVotes: 400,
            candidates: [
              { id: 1, name: "Mimi Lala", votes: 250, percentage: 62.5 },
              { id: 2, name: "Toto Lino", votes: 150, percentage: 37.5 },
              { id: 3, name: "Toto Lino", votes: 150, percentage: 37.5 },
            ],
          },
        ],
      },
      {
        date: "March 2025",
        elections: [
          {
            position: "SSG Secretary",
            totalVotes: 320,
            candidates: [
              { id: 1, name: "Anna Dela Cruz", votes: 180, percentage: 56.25 },
              { id: 2, name: "Lino Carpio", votes: 140, percentage: 43.75 },
            ],
          },
        ],
      },
    ],
  },
];

export default function Results() {
  const [selectedYear, setSelectedYear] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const years = electionData.map((d) => d.year);

  const selectedData = electionData.find(
    (y) => String(y.year) === selectedYear?.value
  );

  console.log(selectedData);
  console.log(selectedYear);

  return (
    <ScrollView className="py-10 px-3 bg-BGlight dark:bg-BGdark">
      <View className="flex flex-row justify-between items-center mb-6">
        <Text variant="h1" className="text-TEXTdark dark:text-TEXTlight">
          Election Results
        </Text>
        <ThemeToggle />
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
