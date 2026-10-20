import Link from "next/link";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { desc, eq } from "drizzle-orm";
import { decideBorrowRequest, returnBorrowedBook } from "@/lib/admin/actions/dashboard";

const Page = async () => {
  const requests = await db.select({ id: borrowRecords.id, createdAt: borrowRecords.createdAt, title: books.title, bookId: books.id, availableCopies: books.availableCopies, name: users.fullName, email: users.email })
    .from(borrowRecords).innerJoin(books, eq(borrowRecords.bookId, books.id)).innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.status, "PENDING")).orderBy(desc(borrowRecords.createdAt));
  const loans = await db.select({ id: borrowRecords.id, dueDate: borrowRecords.dueDate, title: books.title, bookId: books.id, name: users.fullName, email: users.email })
    .from(borrowRecords).innerJoin(books, eq(borrowRecords.bookId, books.id)).innerJoin(users, eq(borrowRecords.userId, users.id))
    .where(eq(borrowRecords.status, "BORROWED")).orderBy(desc(borrowRecords.borrowDate));

  return <div className="space-y-7">
    <section className="rounded-2xl bg-white p-7">
      <h1 className="text-xl font-semibold text-dark-400">Borrow Requests</h1>
      <p className="mt-1 text-sm text-slate-500">Approve requests when a copy is available, or reject them.</p>
      <div className="mt-6 space-y-3">{requests.map((request) => <article key={request.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
        <div><Link href={`/books/${request.bookId}`} className="font-semibold text-dark-400 hover:underline">{request.title}</Link><p className="mt-1 text-sm text-slate-600">Requested by {request.name} | {request.email}</p><p className="mt-1 text-xs text-slate-500">{request.availableCopies} copies available</p></div>
        <div className="flex gap-2"><form action={decideBorrowRequest.bind(null, request.id, "APPROVE")}><button disabled={request.availableCopies < 1} className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button></form><form action={decideBorrowRequest.bind(null, request.id, "REJECT")}><button className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white">Reject</button></form></div>
      </article>)}{!requests.length && <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">There are no pending borrow requests.</p>}</div>
    </section>
    <section className="rounded-2xl bg-white p-7">
      <h2 className="text-lg font-semibold text-dark-400">Active Loans</h2>
      <div className="mt-5 space-y-3">{loans.map((loan) => <article key={loan.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
        <div><Link href={`/books/${loan.bookId}`} className="font-semibold text-dark-400 hover:underline">{loan.title}</Link><p className="mt-1 text-sm text-slate-600">Borrowed by {loan.name} | {loan.email}</p><p className="mt-1 text-xs text-slate-500">Due {loan.dueDate}</p></div>
        <form action={returnBorrowedBook.bind(null, loan.id)}><button className="rounded-md bg-primary-admin px-4 py-2 text-sm font-semibold text-white">Mark Returned</button></form>
      </article>)}{!loans.length && <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">There are no active loans.</p>}</div>
    </section>
  </div>;
};

export default Page;
