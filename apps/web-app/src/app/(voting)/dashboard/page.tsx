import Typography from "@/components/ui/Typography";
import ElectionsCard from "@/components/dashboard/ElectionsCard";

const Dashboard = () => {
  // Sample Data
  // TODO: Replace this later with supabase data
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

  return (
    <div>
      <Typography variant="h2" className="">
        Active Elections
      </Typography>
      <Typography variant="p" className="text-muted-foreground mb-6">
        Click on an election to view candidates and cast your vote.
      </Typography>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {elections.map((election) => (
          <ElectionsCard
            key={election.title}
            electionTitle={election.title}
            voted={election.voted}
            candidates={election.candidates}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
