import Link from "next/link";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { count, desc, eq } from "drizzle-orm";

const Page = async () => {
  const [[bookCount], [userCount], [pendingUsers], [pendingBorrows], [activeLoans], recentBooks] = await Promise.all([
    db.select({ total: count() }).from(books),
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(users).where(eq(users.status, "PENDING")),
    db.select({ total: count() }).from(borrowRecords).where(eq(borrowRecords.status, "PENDING")),
    db.select({ total: count() }).from(borrowRecords).where(eq(borrowRecords.status, "BORROWED")),
    db.select({ id: books.id, title: books.title, author: books.author, createdAt: books.createdAt })
      .from(books).orderBy(desc(books.createdAt)).limit(5),
  ]);

  const stats = [
    ["Books in catalog", bookCount.total, "/admin/books"],
    ["Registered users", userCount.total, "/admin/users"],
    ["Pending accounts", pendingUsers.total, "/admin/account-requests"],
    ["Pending borrow requests", pendingBorrows.total, "/admin/book-requests"],
    ["Books currently borrowed", activeLoans.total, "/admin/book-requests"],
  ] as const;

  return (
    <div className="space-y-7">
      <section>
        <h1 className="text-2xl font-semibold text-dark-400">Dashboard Home</h1>
        <p className="mt-1 text-slate-500">A live overview of the library.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map(([label, value, href]) => (
          <Link href={href} key={label} className="rounded-xl bg-white p-5 shadow-sm hover:shadow-md">
            <p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold text-dark-400">{value}</p>
          </Link>
        ))}
      </section>
      <section className="rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-dark-400">Recently added books</h2>
          <Link href="/admin/books" className="text-sm font-semibold text-primary-admin">View all</Link>
        </div>
        {recentBooks.length ? <ul className="mt-5 divide-y">
          {recentBooks.map((book) => <li key={book.id} className="flex justify-between gap-4 py-3">
            <Link href={`/books/${book.id}`} className="font-medium text-dark-400 hover:underline">{book.title}</Link>
            <span className="text-sm text-slate-500">{book.author}</span>
          </li>)}
        </ul> : <p className="mt-4 text-slate-500">No books have been added yet.</p>}
      </section>
    </div>
  );
};

export default Page;
