import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";


const Home = async () => {
  const session = await auth();

  const latestBooks =(await db
  .select()
  .from(books)
  .limit(10)
  .orderBy(desc(books.createdAt))) as Book[];
  
  if (latestBooks.length === 0) {
    return (
      <section className="rounded-2xl bg-dark-300 p-8">
        <h1 className="font-bebas-neue text-4xl text-light-100">Welcome to your library</h1>
        <p className="mt-3 text-light-200">The catalog is empty right now. Visit the library again soon.</p>
      </section>
    );
  }

  return (
    <>
      <BookOverview {...latestBooks[0]} userId={session?.user?.id as string} />

      <BookList title="Latest Books" books={latestBooks.slice(1)} containerClassName="mt-28" />
    </>
  );
}

export default Home;
