"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/permissions";
import dayjs from "dayjs";

export const updateAccountStatus = async (userId: string, status: "APPROVED" | "REJECTED") => {
  await requireAdmin();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) return;
  await db.update(users).set({ status }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
  revalidatePath("/admin/account-requests");
};

export const returnBorrowedBook = async (recordId: string) => {
  await requireAdmin();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recordId)) return;
  const [record] = await db
    .update(borrowRecords)
    .set({ status: "RETURNED", returnDate: dayjs().format("YYYY-MM-DD") })
    .where(and(eq(borrowRecords.id, recordId), eq(borrowRecords.status, "BORROWED")))
    .returning({ bookId: borrowRecords.bookId });

  if (record) {
    await db.update(books)
      .set({ availableCopies: sql`${books.availableCopies} + 1` })
      .where(and(eq(books.id, record.bookId), lt(books.availableCopies, books.totalCopies)));
  }
  revalidatePath("/admin");
  revalidatePath("/admin/book-requests");
  revalidatePath("/admin/books");
}

export const decideBorrowRequest = async (recordId: string, decision: "APPROVE" | "REJECT") => {
  await requireAdmin();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recordId)) return;

  const [request] = await db.select({ bookId: borrowRecords.bookId })
    .from(borrowRecords)
    .where(and(eq(borrowRecords.id, recordId), eq(borrowRecords.status, "PENDING")))
    .limit(1);
  if (!request) return;

  if (decision === "REJECT") {
    await db.update(borrowRecords).set({ status: "REJECTED" })
      .where(and(eq(borrowRecords.id, recordId), eq(borrowRecords.status, "PENDING")));
  } else {
    const [updatedBook] = await db.update(books)
      .set({ availableCopies: sql`${books.availableCopies} - 1` })
      .where(and(eq(books.id, request.bookId), gt(books.availableCopies, 0)))
      .returning({ id: books.id });
    if (!updatedBook) return;

    const [approved] = await db.update(borrowRecords).set({ status: "BORROWED" })
      .where(and(eq(borrowRecords.id, recordId), eq(borrowRecords.status, "PENDING")))
      .returning({ id: borrowRecords.id });
    if (!approved) {
      await db.update(books).set({ availableCopies: sql`${books.availableCopies} + 1` }).where(eq(books.id, request.bookId));
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/book-requests");
  revalidatePath("/admin/books");
};
