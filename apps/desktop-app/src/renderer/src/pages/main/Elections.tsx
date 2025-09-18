import Typography from "@renderer/components/ui/Typography";
import { DataTable } from "@renderer/components/ui/DataTable";
import {
  useElectionColumns,
  Election,
} from "@renderer/components/elections/column";

const elections: Election[] = [
  {
    id: "1",
    election: "aPresident",
    candidates: 1,
    duration: "13 Days",
    status: "Open",
  },
  {
    id: "2",
    election: "bPresident",
    candidates: 3,
    duration: "Done",
    status: "Closed",
  },
  {
    id: "3",
    election: "cPresident",
    candidates: 4,
    duration: "3 Days",
    status: "Open",
  },
  {
    id: "4",
    election: "AdPresident",
    candidates: 5,
    duration: "14 hrs",
    status: "Open",
  },
  {
    id: "5",
    election: "President",
    candidates: 10,
    duration: "Done",
    status: "Closed",
  },
  {
    id: "6",
    election: "President",
    candidates: 10,
    duration: "Done",
    status: "Closed",
  },
  {
    id: "7",
    election: "President",
    candidates: 10,
    duration: "Done",
    status: "Closed",
  },
  {
    id: "8",
    election: "President",
    candidates: 10,
    duration: "Done",
    status: "Closed",
  },
  {
    id: "8",
    election: "V",
    candidates: 10,
    duration: "Done",
    status: "Closed",
  },
];

const Elections = (): React.JSX.Element => {
  const columns = useElectionColumns();

  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Elections
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Managing and Tracking Elections
        </Typography>
      </header>

      {/* 📊 DataTable */}
      <DataTable
        columns={columns}
        data={elections}
        searchPlaceholder="Search Elections..."
        addButtonLabel="Add New Election"
      />
    </div>
  );
};

export default Elections;
