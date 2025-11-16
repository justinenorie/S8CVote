import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@renderer/components/ui/select";
import Typography from "../ui/Typography";
import { CalendarDays } from "lucide-react";

interface YearSelectionCardProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

const YearSelectionCard = ({
  years,
  selectedYear,
  onSelectYear,
}: YearSelectionCardProps): React.ReactElement => {
  return (
    <div className="bg-card items-center justify-between rounded-2xl p-5 shadow-md transition hover:shadow-lg sm:flex">
      <div className="flex items-center gap-2 pb-5 sm:p-0">
        <CalendarDays size={30} />
        <Typography variant="h4">Select Election Period</Typography>
      </div>
      <Select
        onValueChange={(value) => onSelectYear(Number(value))}
        defaultValue={String(selectedYear)}
      >
        <SelectTrigger className="border-border w-full sm:w-50">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearSelectionCard;
