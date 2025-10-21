import * as React from "react";
// TODO: import trending down later on... <TrendingDown />
// import { TrendingUp } from "lucide-react";
import Typography from "../ui/Typography";

type SummaryStatProps = {
  title: string;
  value: string | number;
};

const SummaryStat = ({ title, value }: SummaryStatProps): React.JSX.Element => {
  return (
    <div className="bg-PRIMARY-50 dark:bg-PRIMARY-950 text-TEXTdark dark:border-PRIMARY-700 dark:text-TEXTlight flex w-auto flex-col gap-2 rounded-2xl p-4 shadow-[7px_8px_17px_-1px_rgba(0,_0,_0,_0.1)] dark:border-1 dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h4">{title}</Typography>
        {/* TODO: change the icons it depends on the summary stats */}
        {/* <Users className="h-4 w-4 text-gray-400" /> */}
      </div>

      {/* Main Value */}
      <Typography variant="h3" className="font-bold">
        {value}
      </Typography>
    </div>
  );
};

export default SummaryStat;
