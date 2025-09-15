import Typography from "@renderer/components/ui/Typography";
import SummaryStat from "@renderer/components/dashboard/SummaryStat";

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

      <Typography variant="h1">Hi</Typography>
      <Typography variant="h2">Hi</Typography>
      <Typography variant="h3">Hi</Typography>
      <Typography variant="h4">Hi</Typography>
      <Typography variant="p">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolor,
        praesentium.
      </Typography>
      <Typography variant="p">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
        consequuntur error labore doloremque excepturi quidem? Tempora in
        incidunt repellendus amet.
      </Typography>
      <Typography variant="small">
        rror labore doloremque excepturi quidem? Tempora in incidunt repellendus
        amet.
      </Typography>
      {/* Cards, charts, etc */}
    </div>
  );
};

export default Dashboard;
