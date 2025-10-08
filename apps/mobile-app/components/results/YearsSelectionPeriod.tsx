import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Calendar } from "lucide-react-native";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useTheme } from "@/components/ThemeProvider";

export default function YearsSelectionPeriod({
  years,
  selectedYear,
  onChangeYear,
}: any) {
  const { theme } = useTheme();
  const iconColor =
    theme === "dark" ? "hsl(225 83.3% 95.3%)" : "hsl(228.6 84% 4.9%)"; // or use your custom color tokens

  return (
    <View className="mb-4 p-4 bg-white dark:bg-PRIMARY950 rounded-2xl shadow-sm border border-border">
      <View className="flex-row items-center mb-2 gap-2">
        <Calendar color={iconColor} size={20} />
        <Text variant="h4" className="text-TEXTdark dark:text-TEXTlight">
          Select Election Period
        </Text>
      </View>

      <Select value={selectedYear ?? ""} onValueChange={onChangeYear}>
        <SelectTrigger className="border rounded-lg p-3 bg-PRIMARY50 dark:bg-PRIMARY800">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year: number) => (
            <SelectItem key={year} value={String(year)} label={String(year)} />
          ))}
        </SelectContent>
      </Select>
    </View>
  );
}
