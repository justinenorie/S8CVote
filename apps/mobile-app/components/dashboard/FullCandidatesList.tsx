import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Candidate = {
  id: string | number;
  name: string;
  votes: number;
  percentage: number;
  partylist?: string | null;
  acronym?: string | null;
  color?: string | null;
};

const getOrdinalNumber = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

const getTextColor = (bgColor: string | null): string => {
  if (!bgColor) return "#000";
  const c = bgColor.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000" : "#fff";
};

export default function FullCandidatesList({
  visible,
  onClose,
  title,
  candidates,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  candidates: Candidate[];
}) {
  const [search, setSearch] = useState("");

  const filtered = candidates.filter((c) =>
    (c.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={visible} onOpenChange={onClose} style={{ maxWidth: "100%" }}>
      <DialogContent className="p-6 w-full bg-PRIMARY50 dark:bg-PRIMARY950 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            All Candidates
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <View className="mt-2">
          <Label className="text-muted-foreground">Search Candidates</Label>
          <Input
            placeholder="Search candidate..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {filtered.length === 0 && (
          <Text className="text-center mt-3 text-muted-foreground">
            No matching candidates.
          </Text>
        )}

        <View className="gap-4" style={{ maxHeight: 300 }}>
          <ScrollView
            contentContainerStyle={{ paddingVertical: 8, gap: 16 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {filtered.map((c, index) => {
              const isWinner = index === 0;
              const partyColor = c.color || "#9ca3af";
              const acronym = c.acronym || "N/A";

              return (
                <TouchableOpacity
                  key={c.id}
                  className={`rounded-md border p-3 ${
                    isWinner
                      ? "bg-green-300/20 border-green-400"
                      : "bg-PRIMARY50 dark:bg-PRIMARY900 border-border"
                  }`}
                >
                  {/* Header */}
                  <View className="mb-2 flex flex-row items-center gap-2 justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <Text variant="small" className="text-foreground">
                        {getOrdinalNumber(index + 1)}
                      </Text>
                      <Text variant="p" className="text-foreground">
                        {c.name}
                      </Text>
                    </View>

                    {c.acronym && (
                      <Text
                        className="px-2 py-0.5 text-xs font-bold rounded-full"
                        style={{
                          backgroundColor: partyColor,
                          color: getTextColor(partyColor),
                        }}
                      >
                        {acronym}
                      </Text>
                    )}
                  </View>

                  {/* Votes */}
                  <View className="flex flex-row justify-between">
                    <Text variant="h4" className="text-foreground">
                      {c.votes} <Text variant="small">Votes</Text>
                    </Text>
                    <Text variant="p" className="text-foreground">
                      {c.percentage}%
                    </Text>
                  </View>

                  {/* Progress */}
                  <View className="bg-PRIMARY100 dark:bg-PRIMARY950 h-2 mt-2 w-full rounded-full">
                    <View
                      className="bg-SECONDARY400 dark:bg-SECONDARY200 h-2 rounded-full"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Button
            variant="outline"
            className="bg-PRIMARY50 dark:bg-PRIMARY950 active:bg-PRIMARY-100 active:dark:bg-PRIMARY800"
            onPress={() => onClose()}
          >
            <Text>Close</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
