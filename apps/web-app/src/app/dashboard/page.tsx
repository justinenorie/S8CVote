import Typography from "@/components/ui/Typography";
import DashboardElectionList from "@/components/dashboard/DashboardElectionList";

const Dashboard = () => {
  return (
    <div>
      <Typography variant="h2">Active Elections</Typography>
      <Typography variant="p" className="text-muted-foreground mb-6">
        Click on an election to view candidates and cast your vote.
      </Typography>

      <DashboardElectionList />
    </div>
  );
};

export default Dashboard;
