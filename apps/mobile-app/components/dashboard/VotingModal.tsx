import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CircleCheck, CircleAlert } from "lucide-react-native";
import Toast from "react-native-toast-message";

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
import { useVoteStore } from "@/store/useVoteStore";
import { Candidate } from "@/types/api";
import { getTextColor } from "@/utils/getTextColor";

export const VotingModal = ({ visible, onClose, election }: any) => {
  const [step, setStep] = useState<"input" | "success">("input");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { verifyStudent, castVote } = useVoteStore();

  const handleSubmitStudentId = async () => {
    if (studentId.trim() === "") {
      setErrorMessage("Please enter your Student ID.");
      return;
    }

    setLoading(true);
    const { data, error } = await verifyStudent(studentId, election.id);
    Toast.show({
      type: "success",
      text1: `Your studentID has been verified.`,
      text2: `You can now vote ${studentId}`,
    });
    setLoading(false);

    if (error) {
      setErrorMessage(`${error}`);
      return;
    }

    if (!data?.is_valid) {
      setErrorMessage("Student not found.");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Student not found.`,
      });
      return;
    }

    if (data?.has_voted) {
      setErrorMessage(
        `${data.student_name} has already voted in this election.`
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `${data.student_name} has already voted in this election.`,
      });
      return;
    }

    setStudentName(data.student_name);
    setErrorMessage("");
    setStep("success");
  };

  const handleConfirmVote = async () => {
    setLoading(true);
    if (!selectedCandidate) return;

    const { error } = await castVote(
      election.id,
      selectedCandidate?.candidate_id,
      studentId
    );

    Toast.show({
      type: "success",
      text1: `Vote Submitted!`,
      text2: `Thank you, ${studentName}! Your vote has been recorded..`,
    });

    if (error) {
      setErrorMessage(error);
      return;
    }

    setLoading(false);
    onClose();
    reset();
  };

  const handleCancelStudentInput = () => {
    onClose();
    setErrorMessage("");
    reset();
  };

  const handleCancelVote = () => {
    setSelectedCandidate(null);
    setStep("input");
    setErrorMessage("");
    reset();
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
                onPress={handleCancelStudentInput}
              >
                <Text>Cancel</Text>
              </Button>

              <Button
                variant="default"
                className="bg-PRIMARY900 dark:bg-PRIMARY50 active:bg-PRIMARY800 active:dark:bg-PRIMARY200"
                onPress={handleSubmitStudentId}
              >
                {/* {loading ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text className="text-TEXTlight dark:text-TEXTdark">Sign in</Text>
                          )} */}

                <Text className="text-TEXTlight dark:text-TEXTdark">
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-TEXTlight dark:text-TEXTdark">
                      Submit
                    </Text>
                  )}
                </Text>
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
                {election.candidates.map((candi: Candidate) => {
                  const isSelected =
                    selectedCandidate?.candidate_id === candi.candidate_id;

                  const partyColor = candi.partylist_color || "#9ca3af";
                  const acronyms = candi.partylist_name || "N/A";
                  return (
                    <TouchableOpacity
                      key={candi.candidate_id}
                      onPress={() => setSelectedCandidate(candi)}
                      activeOpacity={0.8}
                      className={`border rounded-xl p-3  ${
                        isSelected
                          ? "border-PRIMARY900 bg-PRIMARY100 dark:bg-PRIMARY800"
                          : "border-border bg-white dark:bg-PRIMARY900"
                      }`}
                    >
                      <View className="flex flex-row ">
                        <Image
                          source={{ uri: `${candi.candidate_profile}` }}
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
                          {candi.candidate_name}
                        </Text>
                      </View>
                      <Text
                        className="rounded-full border-2 px-2 py-0.5 text-xs font-bold uppercase"
                        style={{
                          backgroundColor: partyColor,
                          color:
                            acronyms === "N/A"
                              ? "#e9eefd"
                              : getTextColor(partyColor),
                          textAlign: "center",
                        }}
                      >
                        {acronyms}
                      </Text>
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

              {/* TODO: add a loading here later "loading" */}
              <Button
                className="bg-PRIMARY900 dark:bg-PRIMARY50 active:bg-PRIMARY800 active:dark:bg-PRIMARY200"
                onPress={handleConfirmVote}
                disabled={!selectedCandidate}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    className={`${
                      selectedCandidate
                        ? "text-TEXTlight dark:text-TEXTdark"
                        : "text-gray-400"
                    }`}
                  >
                    Submit Vote
                  </Text>
                )}
              </Button>
            </View>
          </View>
        )}
      </DialogContent>
    </Dialog>
  );
};
