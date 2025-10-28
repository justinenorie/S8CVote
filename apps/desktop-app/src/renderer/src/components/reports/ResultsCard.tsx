import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@renderer/components/ui/select";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@renderer/components/ui/accordion";
import Typography from "@renderer/components/ui/Typography";

interface Candidate {
  id: string;
  name: string;
  vote_counts: number;
  percentage: number;
}

interface Election {
  id?: string;
  election: string;
  total_votes: number;
  candidates: Candidate[];
}

interface Month {
  date: string;
  elections: Election[];
}

interface ResultsProps {
  id?: number;
  year: number;
  months: Month[];
}

const ResultsCard = ({ data }: { data: ResultsProps }): React.ReactElement => {
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
          className="bg-card rounded-2xl px-5 py-2 shadow-md transition hover:shadow-lg"
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
                      (a, b) => b.vote_counts - a.vote_counts
                    );

                    return (
                      <div
                        key={electionIndex}
                        className="0 space-y-4 rounded-lg p-4"
                      >
                        {/* Top Summary */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <Typography variant="h4">
                              {election.total_votes}
                            </Typography>
                            <Typography
                              variant="small"
                              className="text-muted-foreground"
                            >
                              Total Votes
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h4">
                              {sorted[0].name}
                            </Typography>
                            <Typography
                              variant="small"
                              className="text-muted-foreground"
                            >
                              Winner
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h4">
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

                        {/* Candidate List */}
                        <div className="space-y-2">
                          {sorted.map((c, index) => {
                            const isWinner = index === 0;
                            return (
                              <div
                                key={c.id}
                                className={`rounded-md border p-3 transition ${
                                  isWinner
                                    ? "bg-success/20 border-success"
                                    : "bg-muted/20 hover:bg-muted/30"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <Typography
                                    variant="p"
                                    className="font-medium"
                                  >
                                    {c.name}
                                    {isWinner && (
                                      <span className="bg-success ml-2 rounded-full px-2 py-[1px] text-xs text-white">
                                        Winner 🏆
                                      </span>
                                    )}
                                  </Typography>
                                  <Typography variant="p">
                                    {c.percentage}%
                                  </Typography>
                                </div>
                                <Typography
                                  variant="small"
                                  className="text-muted-foreground"
                                >
                                  {c.vote_counts} Votes
                                </Typography>

                                <div className="bg-muted relative mt-1 h-2 w-full overflow-hidden rounded-full">
                                  <div
                                    className={`absolute top-0 left-0 h-full transition-all ${
                                      isWinner ? "bg-success" : "bg-primary"
                                    }`}
                                    style={{ width: `${c.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
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
