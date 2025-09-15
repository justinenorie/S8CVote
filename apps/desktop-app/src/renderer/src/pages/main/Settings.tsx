import Typography from "@renderer/components/ui/Typography";

const Settings = (): React.JSX.Element => {
  return (
    <div className="text-TEXTdark dark:text-TEXTlight space-y-7">
      <header>
        <Typography variant="h1" className="font-normal">
          Settings
        </Typography>
        <Typography
          variant="p"
          className="text-TEXTdark/60 dark:text-TEXTlight/60"
        >
          Overview of the student voting system
        </Typography>
      </header>
    </div>
  );
};

export default Settings;
