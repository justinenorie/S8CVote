import { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "../ui/label";

interface Candidate {
  id: number;
  name: string;
  votes: number;
  percentage: number;
}

interface Election {
  position: string;
  totalVotes: number;
  candidates: Candidate[];
}

interface Month {
  date: string;
  elections: Election[];
}

interface ResultsProps {
  year: number;
  months: Month[];
}

const ResultsCard = ({ data }: { data?: ResultsProps }) => {
  const [selectedElections, setSelectedElections] = useState<{
    [key: number]: { value: string; label: string } | null;
  }>({});

  return (
    <View className="mt-4 gap-4 mb-20">
      {data?.months.map((month, monthIndex) => (
        <Accordion key={monthIndex} type="single" collapsible>
          <AccordionItem
            value={`month-${monthIndex}`}
            className="bg-PRIMARY50 dark:bg-PRIMARY900 rounded-lg border border-border"
          >
            <AccordionTrigger>
              <View className="px-4 py-3">
                <Text
                  variant="h1"
                  className="text-TEXTdark dark:text-TEXTlight"
                >
                  {month.date}
                </Text>
                <Text
                  variant="small"
                  className="text-TEXTdark dark:text-TEXTlight"
                >
                  {month.elections.length} Elections Completed
                </Text>
              </View>
            </AccordionTrigger>

            {/* Election Content */}
            <AccordionContent>
              <View className="px-4 pb-4">
                <Label>Elections:</Label>
                <Select
                  onValueChange={(option) => {
                    if (option !== undefined) {
                      setSelectedElections(
                        (prev: {
                          [key: number]: {
                            value: string;
                            label: string;
                          } | null;
                        }) => ({
                          ...prev,
                          [monthIndex]: {
                            value: option.value,
                            label: option.label,
                          },
                        })
                      );
                    }
                  }}
                  value={selectedElections[monthIndex] ?? undefined} // 👈 no need for ""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Election" />
                  </SelectTrigger>
                  <SelectContent>
                    {month.elections.map((elec, elecIndex) => (
                      <SelectItem
                        key={elecIndex}
                        value={elec.position}
                        label={elec.position}
                      />
                    ))}
                  </SelectContent>
                </Select>

                {month.elections
                  .filter(
                    (election) =>
                      election.position === selectedElections[monthIndex]?.value
                  )
                  .map((election, electionIndex) => {
                    const sortedCandidates = [...election.candidates].sort(
                      (a, b) => b.votes - a.votes
                    );

                    return (
                      <View key={electionIndex} className="mt-4 gap-3">
                        {sortedCandidates.map((c, index) => {
                          const isWinner = index === 0;
                          const rank = isWinner ? "Winner" : `${index + 1}`;

                          return (
                            <View
                              key={c.id}
                              className={`flex-row items-center p-3 rounded-xl border ${
                                isWinner
                                  ? "bg-green-100 dark:bg-green-300/30 border-green-400"
                                  : "bg-PRIMARY100 dark:bg-PRIMARY900 border-border"
                              }`}
                            >
                              {/* Circle placeholder */}
                              <View className="w-12 h-12 rounded-full border bg-gray-200 dark:bg-gray-600 mr-3" />

                              {/* Candidate Info */}
                              <View className="flex-1">
                                <View className="flex-row justify-between mb-1">
                                  <Text
                                    variant="h3"
                                    className="text-TEXTdark dark:text-TEXTlight"
                                  >
                                    {c.name}
                                  </Text>
                                  <Text
                                    className={`px-2 rounded-full text-xs  ${
                                      isWinner
                                        ? "bg-green-400 text-black"
                                        : "bg-gray-300 dark:bg-gray-700 text-white"
                                    }`}
                                  >
                                    {rank} {isWinner && "🏆"}
                                  </Text>
                                </View>

                                <View className="flex-row justify-between mb-2">
                                  <Text variant="h4" className="text-green-600">
                                    {c.votes} Votes
                                  </Text>
                                  <Text
                                    variant="small"
                                    className="text-TEXTdark dark:text-TEXTlight"
                                  >
                                    {c.percentage}%
                                  </Text>
                                </View>

                                {/* Progress bar */}
                                <View className="h-2 w-full bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <View
                                    className={`h-2 ${
                                      isWinner ? "bg-green-600" : "bg-blue-500"
                                    }`}
                                    style={{ width: `${c.percentage}%` }}
                                  />
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
              </View>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </View>
  );
};

export default ResultsCard;
