"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollText, Trophy, FileUser } from "lucide-react";
import Typography from "@/components/ui/Typography";

interface Candidate {
  id: string | null;
  name: string;
  votes: number;
  percentage: number;
  image: string | null;
  partylist: string | null;
  acronym: string | null;
  color: string | null;
}

interface Election {
  id: string | null;
  election: string;
  total_votes: number;
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

const ResultsCard = ({ data }: { data: ResultsProps }) => {
  const [selectedElections, setSelectedElections] = useState<{
    [key: number]: string | null;
  }>({});

  return (
    <div className="space-y-4">
      {data.months.map((month, monthIndex) => (
        <Accordion
          type="single"
          collapsible
          key={monthIndex}
          className="bg-card hover:bg-PRIMARY-100/50 dark:hover:bg-PRIMARY-800/70 rounded-2xl px-5 py-2 shadow-md transition hover:shadow-lg"
        >
          <AccordionItem value={`month-${monthIndex}`}>
            <AccordionTrigger className="items-center">
              <div className="flex flex-col gap-0">
                <Typography variant="p">{month.date}</Typography>
                <Typography variant="small" className="text-muted-foreground">
                  {month.elections.length} Elections Completed
                </Typography>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              {/* Election Selector to show the selected complete elections */}
              <div className="mb-4">
                <Select
                  onValueChange={(value) =>
                    setSelectedElections((prev) => ({
                      ...prev,
                      [monthIndex]: value,
                    }))
                  }
                  defaultValue={""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Election" />
                  </SelectTrigger>
                  <SelectContent>
                    {month.elections.map((elec, elecIndex) => (
                      <SelectItem key={elecIndex} value={elec.election}>
                        {elec.election}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show selected election only */}
              <div className="space-y-6">
                {month.elections
                  .filter(
                    (election) =>
                      election.election === selectedElections[monthIndex]
                  )
                  .map((election, electionIndex) => {
                    const sorted = [...election.candidates].sort(
                      (a, b) => b.votes - a.votes
                    );

                    return (
                      <div key={electionIndex} className="space-y-4 rounded-lg">
                        {/* Top Summary */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="border-PRIMARY-700 dark:border-PRIMARY-400 flex flex-row items-center justify-start gap-4 rounded-lg border-1 p-6">
                            <ScrollText size={50} />
                            <div className="text-left">
                              <Typography variant="h3">
                                {election.total_votes}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-muted-foreground"
                              >
                                Overall Election Collected Votes
                              </Typography>
                            </div>
                          </div>

                          <div className="border-PRIMARY-700 dark:border-PRIMARY-400 flex flex-row items-center justify-start gap-4 rounded-lg border-1 p-6">
                            {/* Check who's winner or first place */}
                            <Trophy size={50} />
                            <div className="text-left">
                              <Typography variant="h3">
                                {sorted[0].name}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-muted-foreground"
                              >
                                Winner
                              </Typography>
                            </div>
                          </div>
                          <div className="border-PRIMARY-700 dark:border-PRIMARY-400 flex flex-row items-center justify-start gap-4 rounded-lg border-1 p-6">
                            <FileUser size={50} />
                            <div className="text-left">
                              <Typography variant="h3">
                                {election.candidates.length}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-muted-foreground"
                              >
                                Total Candidates
                              </Typography>
                            </div>
                          </div>
                        </div>

                        {/* Candidate List */}
                        <div>
                          <Typography variant="h3">Candidates</Typography>
                          <div className="space-y-4">
                            {sorted.map((c, index) => {
                              const isWinner = index === 0;

                              return (
                                <div
                                  key={c.id}
                                  className={`rounded-md border p-4 transition ${
                                    isWinner
                                      ? "bg-SUCCESSlight/20 border-SUCCESSlight"
                                      : "border-PRIMARY-700 dark:border-PRIMARY-400"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <Typography
                                      variant="p"
                                      className="flex flex-row items-center gap-4 font-medium"
                                    >
                                      {c.name}
                                      {isWinner && (
                                        <Typography
                                          variant="small"
                                          className="bg-SUCCESSlight/30 flex flex-row items-center gap-2 rounded-full px-3 py-1"
                                        >
                                          Winner
                                          <Trophy size={20} />
                                        </Typography>
                                      )}
                                    </Typography>
                                    <Typography variant="p">
                                      {c.percentage}%
                                    </Typography>
                                  </div>
                                  <div className="flex flex-row items-end gap-2">
                                    <Typography
                                      variant="h3"
                                      className="text-muted-foreground"
                                    >
                                      {c.votes}
                                    </Typography>
                                    <Typography variant="p">Votes</Typography>
                                  </div>

                                  <div className="bg-PRIMARY-100 dark:bg-PRIMARY-950 relative mt-1 h-2 w-full overflow-hidden rounded-full">
                                    <div
                                      className="bg-SECONDARY-400 dark:bg-SECONDARY-200 h-2 rounded-full transition-all"
                                      style={{ width: `${c.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default ResultsCard;
