import Typography from "@/components/ui/Typography";
import DashboardElectionList from "@/components/dashboard/DashboardElectionList";

const Dashboard = () => {
  return (
    <>
      <div className="mb-6">
        <Typography variant="h2">Active Elections</Typography>
        <Typography variant="p" className="text-muted-foreground">
          Click on an election to view candidates and cast your vote.
        </Typography>
      </div>

      <DashboardElectionList />
    </>
  );
};

export default Dashboard;
