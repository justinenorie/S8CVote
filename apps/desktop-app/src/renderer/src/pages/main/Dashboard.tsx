import { useEffect } from "react";
import Typography from "@renderer/components/ui/Typography";
import SummaryStat from "@renderer/components/dashboard/SummaryStat";
import ElectionsCard from "@renderer/components/dashboard/ElectionsCard";
import { useDashboardStore } from "@renderer/stores/useDashboardStore";
import { useRealtimeSync } from "@renderer/hooks/useRealtimeSync";

// TODO: Change this later based on the database
const sampleSummaryStats = [
  {
    id: "1",
    title: "Total Student's Voted",
    value: "1000",
  },
  {
    id: "2",
    title: "Elections Highest Votes",
    value: "SSG President - 1000 Votes",
  },
  {
    id: "3",
    title: "Overall Collected Votes",
    value: "10,000 Votes",
  },
];

const Dashboard = (): React.JSX.Element => {
  const { elections, loadElections } = useDashboardStore();

  useEffect(() => {
    loadElections();
  }, [loadElections]);

  useRealtimeSync();

  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Dashboard
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Overview of the student voting system
        </Typography>
      </header>

      {/* TODO: map the data here from the database */}
      <div className="grid grid-cols-3 gap-5">
        {sampleSummaryStats.map((sum) => (
          <div key={sum.id}>
            <SummaryStat title={sum.title} value={sum.value} />
          </div>
        ))}
      </div>

      {/* Current Date */}
      <div>
        <Typography variant="h3">Vote Results</Typography>
        <Typography
          variant="small"
          className="text-TEXTdark/70 dark:text-TEXTlight/70"
        >
          As of{" "}
          {new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date())}
        </Typography>
      </div>

      {/* TODO: add a Loading Skeleton */}
      {/* TODO: Add a error for fetching if offline set the message or display to "Cannot fetch the data the status is OFFLINE........"*/}

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {elections.map((elec) => (
          <div key={elec.id} className="mb-6 break-inside-avoid">
            <ElectionsCard
              key={elec.id}
              electionId={elec.id}
              electionTitle={elec.title}
              candidates={elec.candidates.map((candi) => ({
                id: candi.candidate_id,
                name: candi.candidate_name,
                votes: candi.votes_count,
                percentage: candi.percentage,
                image: candi.candidate_profile ?? null,
                partylist: candi.partylist_name || "Independent",
                acronym: candi.partylist_acronym,
                color: candi.partylist_color,
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
