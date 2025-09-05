import { Request, Response } from "express";
import prisma from "../config/database";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

// -----------------------> CATEGORY (Elections)
// TODO: Add the Editing category(elections)
// CREATE CATEGORY
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, description, maxVotesAllowed, status } = req.body;

  try {
    const category = await prisma.category.create({
      data: { title, description, maxVotesAllowed, status },
    });

    const response: ApiResponse<typeof category> = {
      success: true,
      message: "Category created successfully",
      data: category,
    };

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    const response: ApiResponse<null> = {
      success: false,
      message: "Error creating category",
      errors: ["Database error"],
    };
    res.status(500).json(response);
  }
};

// FETCHING CATEGORY
export const getCategories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: { candidates: true }, // include candidates if useful
    });

    const response: ApiResponse<typeof categories> = {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    };

    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error fetching categories",
    };
    res.status(500).json(response);
  }
};

// DELETE CATEGORY
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.category.delete({ where: { id } });
    const response: ApiResponse<null> = {
      success: true,
      message: "Category deleted successfully",
    };

    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error deleting category",
    };
    res.status(500).json(response);
  }
};

// ---------------- CANDIDATE ----------------
// TODO: Add the Editing candidates
// CREATE CANDIDATES
export const addCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, categoryId } = req.body;

  try {
    const candidate = await prisma.candidate.create({
      data: { name, description, categoryId },
    });
    const response: ApiResponse<typeof candidate> = {
      success: true,
      message: "Candidate added successfully",
      data: candidate,
    };

    res.status(201).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error adding candidate",
    };
    res.status(500).json(response);
  }
};

// FETCH CANDIDATES
export const getCandidates = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: { category: true },
    });

    const response: ApiResponse<typeof candidates> = {
      success: true,
      message: "Candidates fetched successfully",
      data: candidates,
    };

    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error fetching candidates",
    };
    res.status(500).json(response);
  }
};

// DELETE CANDIDATES
export const deleteCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.candidate.delete({ where: { id } });
    const response: ApiResponse<null> = {
      success: true,
      message: "Candidate deleted successfully",
    };

    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error deleting candidate",
    };
    res.status(500).json(response);
  }
};

// ---------------- STUDENT ----------------

// Add Student
export const addStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { studentID, fullname } = req.body;

  try {
    const student = await prisma.student.create({
      data: { studentID, fullname },
    });

    const response: ApiResponse<typeof student> = {
      success: true,
      message: "Student added successfully",
      data: student,
    };

    res.status(201).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error adding student",
    };
    res.status(500).json(response);
  }
};

// Fetch Students
export const getStudents = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const students = await prisma.student.findMany();

    const response: ApiResponse<typeof students> = {
      success: true,
      message: "Students fetched successfully",
      data: students,
    };

    res.status(200).json(response);
  } catch (err) {
    const response: ApiResponse<null> = {
      success: false,
      message: "Error fetching students",
    };
    res.status(500).json(response);
  }
};
