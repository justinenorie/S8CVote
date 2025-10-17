"use client";

import { useState } from "react";
import Typography from "@/components/ui/Typography";
import ResultsCard from "@/components/results/ResultsCard";
import YearSelectionCard from "@/components/results/YearSelectionCard";

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
];

const ElectionResults = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const years = electionData.map((y) => y.year);

  // To render data of the selected year
  const selectedData = electionData.find((y) => y.year === selectedYear)!;

  return (
    <div className="space-y-5">
      <div>
        <Typography variant="h2">Election Results</Typography>
        <Typography variant="p" className="text-muted-foreground">
          View detailed results from the elections
        </Typography>
      </div>

      <YearSelectionCard
        years={years}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />

      <ResultsCard data={selectedData} />
    </div>
  );
};

export default ElectionResults;
