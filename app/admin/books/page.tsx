import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { asc } from "drizzle-orm";

const Page = async () => {
  const allBooks = await db.select().from(books).orderBy(asc(books.title));

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><h1 className="text-xl font-semibold text-dark-400">All Books</h1><p className="mt-1 text-sm text-slate-500">{allBooks.length} books in the catalog</p></div>
        <Button className="bg-primary-admin text-white" asChild><Link href="/admin/books/new">+ Create a New Book</Link></Button>
      </div>
      <div className="mt-7 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b text-slate-500"><tr><th className="py-3 pr-4">Title</th><th className="py-3 pr-4">Author</th><th className="py-3 pr-4">Genre</th><th className="py-3 pr-4">Copies</th><th className="py-3">Rating</th><th className="py-3 pl-4">Actions</th></tr></thead>
          <tbody className="divide-y">
            {allBooks.map((book) => <tr key={book.id}>
              <td className="py-4 pr-4 font-medium"><Link className="text-dark-400 hover:underline" href={`/books/${book.id}`}>{book.title}</Link></td>
              <td className="py-4 pr-4 text-slate-600">{book.author}</td><td className="py-4 pr-4 text-slate-600">{book.genre}</td>
              <td className="py-4 pr-4 text-slate-600">{book.availableCopies} / {book.totalCopies}</td><td className="py-4 text-slate-600">{book.rating} / 5</td>
              <td className="py-4 pl-4"><Link href={`/admin/books/${book.id}`} className="font-medium text-primary-admin hover:underline">Edit</Link></td>
            </tr>)}
          </tbody>
        </table>
        {!allBooks.length && <p className="py-8 text-center text-slate-500">The catalog is empty. Create the first book to get started.</p>}
      </div>
    </section>
  );
};

export default Page;
