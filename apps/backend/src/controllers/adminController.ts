import { Request, Response } from "express";
import prisma from "../config/database";

// CATEGORY
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, maxVotesAllowed, status } = req.body;

  try {
    const category = await prisma.category.create({
      data: { title, description, maxVotesAllowed, status },
    });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating category" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.category.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting category" });
  }
};

// CANDIDATE
export const addCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, category } = req.body;

  try {
    const candidate = await prisma.candidate.create({
      data: { name, description, category },
    });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: "Error adding candidate" });
  }
};

export const deleteCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.candidate.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error deleting candidate" });
  }
};

// STUDENT
export const addStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { studentID, fullname } = req.body;

  try {
    const student = await prisma.student.create({
      data: { studentID, fullname },
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: "Error adding student" });
  }
};
