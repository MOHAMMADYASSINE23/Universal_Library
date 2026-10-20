import Link from "next/link";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { asc } from "drizzle-orm";
import BookCard from "@/components/BookCard";

const Page = async () => {
  const libraryBooks = await db.select().from(books).orderBy(asc(books.title)) as Book[];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-bebas-neue text-5xl text-light-100">Library</h1>
          <p className="mt-2 text-light-200">Browse the books available in your library.</p>
        </div>
        <Link href="/dashboard" className="text-primary underline">My Dashboard</Link>
      </div>
      {libraryBooks.length ? (
        <ul className="book-list">
          {libraryBooks.map((book) => <BookCard key={book.id} {...book} />)}
        </ul>
      ) : (
        <p className="mt-8 text-light-200">There are no books in the library yet.</p>
      )}
    </section>
  );
};

export default Page;
