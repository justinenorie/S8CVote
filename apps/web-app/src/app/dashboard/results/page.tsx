import Typography from "@/components/ui/Typography";
import ResultsHistory from "@/components/results/ResultsHistory";

export default function Results() {
  return (
    <>
      <div className="mb-6">
        <Typography variant="h2">Election Results</Typography>
        <Typography variant="p" className="text-muted-foreground">
          View detailed results from the elections
        </Typography>
      </div>

      <ResultsHistory />
    </>
  );
}
