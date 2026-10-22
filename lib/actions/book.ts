"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { and, eq, or } from "drizzle-orm";
import dayjs from "dayjs";
import { auth } from "@/auth";

export const borrowBook = async (params: BorrowBookParams) => {
    const { bookId, userId } = params;

    try {
        const session = await auth();
        if (!session?.user?.id || session.user.id !== userId) {
            return { success: false, error: "Please sign in to borrow a book" };
        }
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(bookId)) {
            return { success: false, error: "Invalid book" };
        }

        const [user] = await db.select({ status: users.status }).from(users).where(eq(users.id, session.user.id)).limit(1);
        if (user?.status !== "APPROVED") {
            return { success: false, error: "Your library account must be approved before borrowing" };
        }

        const book = await db
            .select({ availableCopies: books.availableCopies })
            .from(books)
            .where(eq(books.id, bookId))
            .limit(1);

        if (!book.length || book[0].availableCopies <= 0) {
            return { success: false, error: "Book is not available" };
        }

        const [existingRequest] = await db.select({ id: borrowRecords.id })
            .from(borrowRecords)
            .where(and(
                eq(borrowRecords.userId, session.user.id),
                eq(borrowRecords.bookId, bookId),
                or(eq(borrowRecords.status, "PENDING"), eq(borrowRecords.status, "BORROWED")),
            ))
            .limit(1);
        if (existingRequest) {
            return { success: false, error: "You already have a pending request or active loan for this book" };
        }

        const dueDate = dayjs().add(7, "day").format("YYYY-MM-DD");

        const record = await db.insert(borrowRecords).values({
            bookId,
            userId: session.user.id,
            dueDate,
            status: "PENDING",
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(record)),
        };
    } catch {
        return {
            success: false,
            error: "An error occurred while borrowing the book",
        };
    }
};
