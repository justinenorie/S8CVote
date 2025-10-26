// db/queries/voteQueries.ts
import { db } from "../client";
import { elections, candidates, students, votes } from "../schema";
import { eq, and } from "drizzle-orm";
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

// Insert the votes locally
export async function insertLocalVote(
  electionId: string,
  candidateId: string,
  studentId: string
) {
  const newVote = {
    id: `${Date.now()}-${studentId}`,
    election_id: electionId,
    candidate_id: candidateId,
    student_id: studentId,
    updated_at: new Date().toISOString(),
    synced_at: 0,
  };
  await db.insert(votes).values(newVote);
  return newVote;
}

// Check if student already voted locally
export async function hasLocalVote(studentId: string, electionId: string) {
  const localStudent = await db
    .select()
    .from(students)
    .where(eq(students.student_id, studentId))
    .limit(1);

  if (localStudent.length > 0) {
    const voted = await db
      .select()
      .from(votes)
      .where(
        and(eq(votes.student_id, studentId), eq(votes.election_id, electionId))
      );

    return {
      is_valid: true,
      student_name: localStudent[0].fullname,
      has_voted: voted.length > 0,
    };
  }
}
