import { useEffect, useState } from "react";
import Typography from "@renderer/components/ui/Typography";
import ResultsCard from "@renderer/components/reports/ResultsCard";
import YearSelectionCard from "@renderer/components/reports/YearSelectionCard";
import { useResultsStore } from "@renderer/stores/useResultStore";

const Reports = (): React.ReactElement => {
  const { results, loadResults } = useResultsStore();
  const todayYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(todayYear);

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
