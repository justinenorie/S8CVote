"use client";

import { useState, useEffect } from "react";
import ResultsCard from "@/components/results/ResultsCard";
import YearSelectionCard from "@/components/results/YearSelectionCard";
import { useResultsStore } from "@/stores/useResultsStore";

export default function ResultsHistory() {
  const { results, loadResults } = useResultsStore();
  const todayYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | null>(todayYear);
  const years = results.map((y) => y.year);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const selectedData = results.find((y) => y.year === selectedYear)!;

  return (
    <div className="space-y-5">
      <YearSelectionCard
        years={years}
        selectedYear={selectedYear ?? years[0]}
        onSelectYear={setSelectedYear}
      />

      {selectedData && <ResultsCard data={selectedData} />}
    </div>
  );
}
