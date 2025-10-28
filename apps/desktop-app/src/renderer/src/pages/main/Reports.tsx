import { useState } from "react";
import Typography from "@renderer/components/ui/Typography";
import ResultsCard from "@renderer/components/reports/ResultsCard";
import YearSelectionCard from "@renderer/components/reports/YearSelectionCard";

const electionData = [
  {
    year: 2025,
    months: [
      {
        date: "January 2025",
        elections: [
          {
            id: "1",
            election: "SSG President",
            total_votes: 1100,
            candidates: [
              {
                id: "1",
                name: "Ninomo Binovoto",
                vote_counts: 600,
                percentage: 50.12,
              },
              {
                id: "2",
                name: "Ninomo Binovoto",
                vote_counts: 600,
                percentage: 50.12,
              },
            ],
          },
        ],
      },
    ],
  },
];

const Reports = (): React.ReactElement => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const years = electionData.map((y) => y.year);

  // To render data of the selected year
  const selectedData = electionData.find((y) => y.year === selectedYear)!;

  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-5">
      <div>
        <Typography variant="h1" className="font-normal">
          Election Results
        </Typography>
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

export default Reports;
