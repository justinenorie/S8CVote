import Typography from "@renderer/components/ui/Typography";

const Students = (): React.JSX.Element => {
  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Students
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          View and manage the list of students for voter verification
        </Typography>
      </header>
    </div>
  );
};

export default Students;
