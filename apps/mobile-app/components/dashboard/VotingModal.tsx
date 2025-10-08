import { useState } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleCheck, CircleAlert } from "lucide-react-native";

export const VotingModal = ({ visible, onClose, election }: any) => {
  // TODO: Steps should be the data from supabase
  const [step, setStep] = useState<"input" | "success">("input");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState(""); // TODO: Should be a fetch name
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitId = async () => {
    // TODO: Replace with actual Supabase validation later
    if (studentId.trim() === "") {
      setErrorMessage("Please enter your Student ID.");
      return;
    }
    if (studentId.trim() === "12345") {
      setStudentName("Kor K. Kor");
      setErrorMessage("");
      setStep("success");
    } else if (studentId.trim() === "54321") {
      setErrorMessage("Kor K. Kor has already voted in this election.");
    } else {
      setErrorMessage("Invalid Student ID.");
    }
  };

  // TODO: This is a confirmation votes
  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    console.log(`Student ${studentId} voted for ${selectedCandidate.name}`);
    // TODO: Passing the votes to Supabase
    onClose();
    reset();
  };

  const handleCancelVote = () => {
    setSelectedCandidate(null);
    setStep("input");
    setErrorMessage("");
  };

  const reset = () => {
    setStep("input");
    setStudentId("");
    setStudentName("");
    setSelectedCandidate(null);
    setErrorMessage("");
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="p-6 w-fullj bg-PRIMARY50 dark:bg-PRIMARY950 rounded-2xl ">
        {/* Student ID input */}
        {step === "input" && (
          <View>
            <DialogHeader>
              <DialogTitle>
                <View className="flex flex-col w-full justify-center">
                  <Text
                    className="text-TEXTdark dark:text-TEXTlight text-center"
                    variant="h4"
                  >
                    {election.title}
                  </Text>
                  <Text
                    variant="p"
                    className="leading-0 text-center text-TEXTdark dark:text-TEXTlight"
                  >
                    Cast your vote for this election
                  </Text>
                </View>
              </DialogTitle>
            </DialogHeader>

            <Label className="mt-6">Enter Your Student ID</Label>
            <Input
              placeholder="Student ID"
              value={studentId}
              onChangeText={(text) => {
                setStudentId(text);
                if (errorMessage) setErrorMessage("");
              }}
              className={`mt-1 ${errorMessage ? "border-red-500" : ""}`}
            />

            {errorMessage !== "" && (
              <View className="rounded-md border-2 mt-2 p-2 border-red-500 flex flex-row items-center gap-2">
                <CircleAlert color="hsl(0 84.2% 60.2%)" />
                <Text className="text-ERRORlight">{errorMessage}</Text>
              </View>
            )}

            <View className="flex flex-row justify-end gap-2 mt-6">
              <Button
                variant="outline"
                className="bg-PRIMARY50 dark:bg-PRIMARY950 active:bg-PRIMARY-100 active:dark:bg-PRIMARY800"
                onPress={onClose}
              >
                <Text>Cancel</Text>
              </Button>

              <Button
                variant="default"
                className="bg-PRIMARY900 dark:bg-PRIMARY50 active:bg-PRIMARY800 active:dark:bg-PRIMARY200"
                onPress={handleSubmitId}
              >
                <Text>Submit</Text>
              </Button>
            </View>
          </View>
        )}

        {/* Candidate Selections */}
        {step === "success" && (
          <View>
            <DialogHeader>
              <DialogTitle>
                <View className="flex flex-col w-full justify-center">
                  <Text
                    className="text-TEXTdark dark:text-TEXTlight text-center font-poppins-semibold"
                    variant="h4"
                  >
                    {election.title}
                  </Text>
                  <Text
                    variant="p"
                    className="leading-0 text-center text-TEXTdark dark:text-TEXTlight"
                  >
                    Cast your vote for this election
                  </Text>
                </View>
              </DialogTitle>
            </DialogHeader>

            <View className="mt-5">
              <Label>Student ID</Label>
              <Input
                value={studentId}
                editable={false}
                className="mt-1 border-green-500"
              />
              <View
                className="rounded-md border-2 mt-2 p-2 border-green-500 flex flex-row items-center gap-2"
                // style={{ borderColor: "red" }}
              >
                <CircleCheck color="hsl(144.3 100% 39.2%)" />
                <Text className="text-SUCCEEDEDlight">
                  Verified: {studentName}
                </Text>
              </View>
            </View>

            {/* Candidate List */}
            <Text
              variant="p"
              className="mt-6 text-TEXTdark dark:text-TEXTlight"
            >
              Select Candidates to vote:
            </Text>

            <View className="mt-3 gap-4" style={{ maxHeight: 300 }}>
              <ScrollView className="mt-3" contentContainerStyle={{ gap: 16 }}>
                {election?.candidates?.map((candidate: any) => {
                  const isSelected = selectedCandidate?.id === candidate.id;
                  return (
                    <TouchableOpacity
                      key={candidate.id}
                      onPress={() => setSelectedCandidate(candidate)}
                      activeOpacity={0.8}
                      className={`border rounded-xl p-3  ${
                        isSelected
                          ? "border-PRIMARY900 bg-PRIMARY100 dark:bg-PRIMARY800"
                          : "border-border bg-white dark:bg-PRIMARY900"
                      }`}
                    >
                      <View className="flex flex-row ">
                        <Image
                          source={{ uri: "https://picsum.photos/200" }}
                          className="w-12 h-12 rounded-full mr-3 self-center"
                        />

                        <Text
                          variant="h4"
                          className={`font-poppins-semibold self-center ${
                            isSelected
                              ? "text-PRIMARY900 dark:text-PRIMARY50"
                              : "text-TEXTdark dark:text-TEXTlight"
                          }`}
                        >
                          {candidate.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Action buttons */}
            <View className="flex flex-row justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onPress={handleCancelVote}
                className="bg-PRIMARY50 dark:bg-PRIMARY950 active:bg-PRIMARY-100 active:dark:bg-PRIMARY800"
              >
                <Text className="text-TEXTdark dark:text-TEXTlight">
                  Cancel
                </Text>
              </Button>

              <Button
                className="bg-PRIMARY900 dark:bg-PRIMARY50 active:bg-PRIMARY800 active:dark:bg-PRIMARY200"
                onPress={handleConfirmVote}
                disabled={!selectedCandidate}
              >
                <Text
                  className={`${
                    selectedCandidate
                      ? "text-TEXTlight dark:text-TEXTdark"
                      : "text-gray-400"
                  }`}
                >
                  Submit Vote
                </Text>
              </Button>
            </View>
          </View>
        )}
      </DialogContent>
    </Dialog>
  );
};
