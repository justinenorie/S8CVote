import * as React from "react";
import Typography from "../ui/Typography";

type Candidate = {
  id: string;
  name: string;
  votes: number;
  percentage: number;
  image?: string | null;
  partylist?: string | null;
  acronym?: string | null;
  color?: string | null;
};

interface ElectionCardProps {
  electionId: string;
  electionTitle: string;
  candidates: Candidate[];
}

const getOrdinalNumber = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

// Calculate the background Color for contrast of text color
const getTextColor = (bgColor: string | null): string => {
  if (!bgColor) return "#000"; // default black text

  // Remove # if present
  const color = bgColor.replace("#", "");
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If bright background → use dark text, else use white text
  return luminance > 0.6 ? "#000" : "#fff";
};

const ElectionsCard = ({
  electionTitle,
  candidates,
}: ElectionCardProps): React.JSX.Element => {
  return (
    <div className="bg-PRIMARY-50 dark:bg-PRIMARY-950 dark:border-PRIMARY-700 w-full rounded-2xl p-4 shadow-md dark:border-1">
      <Typography variant="h4" className="mb-3 font-semibold">
        {electionTitle}
      </Typography>

      <div className="space-y-4">
        {candidates.map((cand, index) => {
          const isFirstRunnerUp = index === 0;
          const partyColor = cand.color || "#9ca3af";
          const acronym = cand.acronym || "N/A";

          return (
            <div
              key={cand.id}
              className={`hover:bg-muted/30 border/50 rounded-md p-3 shadow-md transition ${
                isFirstRunnerUp
                  ? "bg-SUCCESSlight/20 border-SUCCESSlight/40 border-1"
                  : "bg-muted/20 hover:bg-muted/30 border-transparent"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Typography variant="small" className="">
                    {getOrdinalNumber(index + 1)}
                  </Typography>
                  <Typography variant="p">{cand.name}</Typography>
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold uppercase"
                    style={{
                      backgroundColor: partyColor,
                      color:
                        acronym === "N/A"
                          ? "#e9eefd"
                          : getTextColor(partyColor),
                      textAlign: "center",
                    }}
                  >
                    {acronym}
                  </span>
                </div>
              </div>

              <div className="text-muted-foreground flex flex-row items-center justify-between">
                <Typography variant="h4">
                  {cand.votes}{" "}
                  <Typography variant="small">Votes</Typography>{" "}
                </Typography>
                <Typography variant="p">{cand.percentage}%</Typography>
              </div>

              {/* Progress bar */}
              <div className="bg-PRIMARY-100 dark:bg-PRIMARY-950 h-2 w-full rounded-full">
                <div
                  className="bg-SECONDARY-400 dark:bg-SECONDARY-200 h-2 rounded-full transition-all"
                  style={{
                    width: `${cand.percentage}%`,
                    // backgroundColor: acronym === "N/A" ? "#00bba7" : partyColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectionsCard;
