import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { ElectionCard } from "@/components/dashboard/ElectionCard";

const elections = [
  {
    title: "SSG President",
    voted: false,
    candidates: [
      {
        id: 1,
        name: "Candidate A",
        image: "/s8cvote.png",
        votes: 600,
        percentage: 50.12,
      },
      {
        id: 2,
        name: "Candidate B",
        image: "/s8cvote.png",
        votes: 400,
        percentage: 33.4,
      },
      {
        id: 3,
        name: "Candidate C",
        image: "/s8cvote.png",
        votes: 200,
        percentage: 16.48,
      },
      {
        id: 4,
        name: "Candidate D",
        image: "/s8cvote.png",
        votes: 200,
        percentage: 16.48,
      },
    ],
  },
  {
    title: "SSG Vice President",
    voted: true,
    candidates: [
      {
        id: 1,
        name: "Candidate A",
        image: "/s8cvote.png",
        votes: 700,
        percentage: 60.1,
      },
      {
        id: 2,
        name: "Candidate B",
        image: "/s8cvote.png",
        votes: 300,
        percentage: 25.3,
      },
      {
        id: 3,
        name: "Candidate C",
        image: "/s8cvote.png",
        votes: 200,
        percentage: 14.6,
      },
    ],
  },
  {
    title: "SSG Secretary",
    voted: false,
    candidates: [
      {
        id: 1,
        name: "Candidate A",
        image: "/s8cvote.png",
        votes: 500,
        percentage: 45.1,
      },
      {
        id: 2,
        name: "Candidate B",
        image: "/s8cvote.png",
        votes: 400,
        percentage: 36.2,
      },
      {
        id: 3,
        name: "Candidate C",
        image: "/s8cvote.png",
        votes: 200,
        percentage: 18.7,
      },
    ],
  },
  {
    title: "SSG for Bai",
    voted: false,
    candidates: [
      {
        id: 1,
        name: "Candidate A",
        image: "/s8cvote.png",
        votes: 500,
        percentage: 45.1,
      },
      {
        id: 2,
        name: "Candidate B",
        image: "/s8cvote.png",
        votes: 400,
        percentage: 36.2,
      },
      {
        id: 3,
        name: "Candidate C",
        image: "/s8cvote.png",
        votes: 200,
        percentage: 18.7,
      },
    ],
  },
];

export default function Dashboard() {
  return (
    <ScrollView className="py-10 px-3 bg-BGlight dark:bg-BGdark">
      <Text
        className="text-TEXTdark dark:text-TEXTlight text-left -mb-3"
        variant="h1"
      >
        Active Elections
      </Text>
      <Text
        variant="p"
        className="text-TEXTdark dark:text-TEXTlight text-left "
      >
        Click on an election to cast your vote.
      </Text>

      <View className="mt-3 mb-10">
        {elections.map((item, index) => (
          <ElectionCard
            key={index}
            title={item.title}
            voted={item.voted}
            candidates={item.candidates}
          />
        ))}
      </View>
    </ScrollView>
  );
}
