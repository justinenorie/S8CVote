import Typography from "@renderer/components/ui/Typography";
import SummaryStat from "@renderer/components/dashboard/SummaryStat";
import ElectionsCard from "@renderer/components/dashboard/ElectionsCard";

// TODO: Change this later based on the database
const sampleCategories = [
  {
    title: "President",
    candidates: [
      { name: "Candidate A", votes: 1000 },
      { name: "Candidate B", votes: 80 },
      { name: "Candidate C", votes: 20 },
      { name: "Candidate C", votes: 0 },
    ],
  },
  {
    title: "Vice President",
    candidates: [
      { name: "Juan Dela Cruz", votes: 450 },
      { name: "Maria Clara", votes: 480 },
    ],
  },
];

const Dashboard = (): React.JSX.Element => {
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
        <SummaryStat title="Total Voters" value={10} subtext="aye" />
        <SummaryStat title="Total Voters" value={10} subtext="aye" />
        <SummaryStat title="Total Voters" value={10} subtext="aye" />
      </div>

      <div>
        <Typography variant="h3">Vote Results</Typography>
        <Typography variant="small">
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

      {/* Elections and Candidates */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {sampleCategories.map((election) => (
          <ElectionsCard key={election.title} category={election} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
