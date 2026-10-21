"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { bookSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/permissions";

export const createBook = async (params: BookParams) => {
  await requireAdmin();
  try {
    const validated = bookSchema.safeParse(params);
    if (!validated.success) {
      return { success: false, message: "Please complete all book fields with valid information" };
    }

    const [newBook] = await db
      .insert(books)
      .values({ ...validated.data, availableCopies: validated.data.totalCopies })
      .returning();

    return { success: true, data: JSON.parse(JSON.stringify(newBook)) };
  } catch (error) {
    console.error("Book creation failed", error);
    return { success: false, message: "An error occurred while creating the book" };
  }
};

export const updateBook = async (bookId: string, params: BookParams) => {
  await requireAdmin();
  try {
    const validated = bookSchema.safeParse(params);
    if (!validated.success || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookId)) {
      return { success: false, message: "Please enter valid book information" };
    }

    const [current] = await db
      .select({ totalCopies: books.totalCopies, availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!current) return { success: false, message: "Book not found" };

    const borrowedCopies = current.totalCopies - current.availableCopies;
    if (validated.data.totalCopies < borrowedCopies) {
      return {
        success: false,
        message: `At least ${borrowedCopies} total copies are needed because books are currently borrowed`,
      };
    }

    const [updated] = await db
      .update(books)
      .set({ ...validated.data, availableCopies: validated.data.totalCopies - borrowedCopies })
      .where(eq(books.id, bookId))
      .returning();

    return { success: true, data: JSON.parse(JSON.stringify(updated)) };
  } catch (error) {
    console.error("Book update failed", error);
    return { success: false, message: "An error occurred while updating the book" };
  }
};
