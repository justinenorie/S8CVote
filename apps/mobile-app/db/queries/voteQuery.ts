// db/queries/voteQueries.ts
import { Election } from "@/types/api";
import { and, eq } from "drizzle-orm";
import { db } from "../client";
import { candidates, elections, students, votes } from "../schema";

export async function getElectionsWithCandidates() {
  const electionRows = await db.select().from(elections);
  const candidateRows = await db.select().from(candidates);

  const grouped = electionRows.map(
    (election): Election => ({
      id: election.id,
      title: election.title,
      has_voted: Boolean(election.has_voted),
      status: election.status,
      position_order: election.position_order ?? 99,
      candidates: candidateRows
        .filter((c) => c.election_id === election.id)
        .sort((a, b) => b.votes_count - a.votes_count),
    })
  );
  grouped.sort((a, b) => (a.position_order ?? 99) - (b.position_order ?? 99));

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
  const student = await db
    .select()
    .from(students)
    .where(eq(students.student_id, studentId))
    .limit(1);

  if (student.length === 0) {
    return {
      is_valid: false,
      student_name: "",
      has_voted: false,
    };
  }

  const voteRecord = await db
    .select()
    .from(votes)
    .where(
      and(eq(votes.student_id, studentId), eq(votes.election_id, electionId))
    );

  return {
    is_valid: true,
    student_name: student[0].fullname,
    has_voted: voteRecord.length > 0, // ✅ Per election
  };
}
