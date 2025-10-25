// db/queries/voteQueries.ts
import { db } from "../client";
import { elections, candidates } from "../schema";
import { eq } from "drizzle-orm";
import { Election } from "@/types/api";

export async function getElectionsWithCandidates() {
  const electionRows = await db.select().from(elections);
  const candidateRows = await db.select().from(candidates);

  const grouped = electionRows.map(
    (election): Election => ({
      id: election.id,
      title: election.title,
      has_voted: Boolean(election.has_voted),
      status: election.status,
      candidates: candidateRows.filter((c) => c.election_id === election.id),
    })
  );

  return grouped;
}

export async function getElectionById(electionId: string) {
  const election = await db
    .select()
    .from(elections)
    .where(eq(elections.id, electionId))
    .limit(1);

  if (!election.length) return null;

  const candidateRows = await db
    .select()
    .from(candidates)
    .where(eq(candidates.election_id, electionId));

  return {
    id: election[0].id,
    title: election[0].title,
    has_voted: Boolean(election[0].has_voted),
    candidates: candidateRows,
  };
}
