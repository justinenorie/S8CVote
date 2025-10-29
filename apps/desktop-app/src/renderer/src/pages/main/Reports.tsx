import { useEffect, useState } from "react";
import Typography from "@renderer/components/ui/Typography";
import ResultsCard from "@renderer/components/reports/ResultsCard";
import YearSelectionCard from "@renderer/components/reports/YearSelectionCard";
import { useResultsStore } from "@renderer/stores/useResultStore";

// const electionData = [
//   {
//     year: 2025,
//     months: [
//       {
//         date: "January 2025",
//         elections: [
//           {
//             id: "1",
//             election: "SSG President",
//             total_votes: 1100,
//             candidates: [
//               {
//                 id: "1",
//                 name: "Ninomo Binovoto",
//                 vote_counts: 600,
//                 percentage: 50.12,
//               },
//               {
//                 id: "2",
//                 name: "Ninomo Binovoto",
//                 vote_counts: 600,
//                 percentage: 50.12,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];

const Reports = (): React.ReactElement => {
  const { results, loadResults } = useResultsStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  // To render data of the selected year
  const years = results.map((y) => y.year);
  const selectedData = selectedYear
    ? results.find((r) => r.year === selectedYear)
    : results[0];

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
        selectedYear={selectedYear ?? years[0]}
        onSelectYear={setSelectedYear}
      />

      {selectedData && <ResultsCard data={selectedData} />}
    </div>
  );
};

export default Reports;
