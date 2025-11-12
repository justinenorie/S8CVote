"use client";

import { useState } from "react";
import Typography from "@renderer/components/ui/Typography";
import { Input } from "@renderer/components/ui/input";

type Candidate = {
  id: string | number;
  name: string;
  votes: number;
  percentage: number;
  image?: string | null;
  partylist?: string | null;
  acronym?: string | null;
  color?: string | null;
};

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

export default function FullCandidatesList({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const [search, setSearch] = useState("");

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="text-foreground -mt-2 flex max-h-[60vh] flex-col">
      {/* Search */}
      <Input
        placeholder="Search candidate..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border-border mb-4 border"
      />

      {/* List */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {filtered.map((c, index) => {
          const isFirstRunnerUp = index === 0;
          const partyColor = c.color || "#9ca3af";
          const acronym = c.acronym || "N/A";

          return (
            <div
              key={c.id}
              className={`hover:bg-muted/30 border-border rounded-md border p-3 transition ${
                isFirstRunnerUp
                  ? "bg-SUCCESSlight/20 border-SUCCESSlight/40 border"
                  : "bg-muted/20"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                  <Typography variant="small" className="">
                    {getOrdinalNumber(index + 1)}
                  </Typography>
                  <Typography variant="p">{c.name}</Typography>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${c.partylist ? "block" : "hidden"}`}
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
                  {c.votes} <Typography variant="small">Votes</Typography>{" "}
                </Typography>
                <Typography variant="p">{c.percentage}%</Typography>
              </div>
              <div className="bg-PRIMARY-100 dark:bg-PRIMARY-950 relative mt-1 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-SECONDARY-400 dark:bg-SECONDARY-200 absolute top-0 left-0 h-full transition-all"
                  style={{ width: `${c.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Typography
          variant="small"
          className="text-muted-foreground py-4 text-center"
        >
          No matching candidates.
        </Typography>
      )}
    </div>
  );
}
