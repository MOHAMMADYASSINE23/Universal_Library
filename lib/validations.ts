import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().trim().min(3).max(255),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export const signInSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  author: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.coerce.number().int().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
  videoUrl: z.string().nonempty(),
  summary: z.string().trim().min(10),
});

export const bookReviewSchema = z.object({
  bookId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().trim().min(10).max(1200),
});
