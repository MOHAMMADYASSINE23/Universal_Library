"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { bookReviews, borrowRecords } from "@/database/schema";
import { bookReviewSchema } from "@/lib/validations";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ReviewInput = {
  bookId: string;
  rating: number;
  review: string;
};

export const submitBookReview = async (input: ReviewInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false as const, message: "Sign in to write a review." };

    const validated = bookReviewSchema.safeParse(input);
    if (!validated.success) return { success: false as const, message: "Choose 1 to 5 stars and write 10 to 1,200 characters." };

    const [verifiedReader] = await db.select({ id: borrowRecords.id })
      .from(borrowRecords)
      .where(and(
        eq(borrowRecords.userId, session.user.id),
        eq(borrowRecords.bookId, validated.data.bookId),
        inArray(borrowRecords.status, ["BORROWED", "RETURNED"]),
      ))
      .limit(1);

    if (!verifiedReader) {
      return { success: false as const, message: "You can review a book after your borrow request is approved." };
    }

    await db.insert(bookReviews).values({
      userId: session.user.id,
      bookId: validated.data.bookId,
      rating: validated.data.rating,
      review: validated.data.review,
    }).onConflictDoUpdate({
      target: [bookReviews.userId, bookReviews.bookId],
      set: {
        rating: validated.data.rating,
        review: validated.data.review,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/books/${validated.data.bookId}`);
    return { success: true as const };
  } catch (error) {
    console.error("Book review could not be saved", error);
    return { success: false as const, message: "Could not save your review. Please try again." };
  }
};
