import { UserRound } from "lucide-react";
import Typography from "../ui/Typography";

const adminSampleData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Pending",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "Pending",
  },
  {
    name: "Peter Jones",
    email: "peter.jones@example.com",
    status: "Pending",
  },
  {
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    status: "Approved",
  },
  {
    name: "Bob Williams",
    email: "bob.williams@example.com",
    status: "Approved",
  },
];

const AdminsTab = (): React.ReactElement => {
  return (
    <div className="space-y-8">
      <div className="bg-card w-full rounded-lg p-6">
        <Typography variant="h4">Pending Admin</Typography>
        <Typography variant="small">
          Registration requests awaiting approval.
        </Typography>
      </div>
      <div className="bg-card w-full rounded-lg p-6">
        <Typography variant="h4">Verified Admins</Typography>
        <Typography variant="small">Active admin account.</Typography>
      </div>
    </div>
  );
};

export default AdminsTab;
