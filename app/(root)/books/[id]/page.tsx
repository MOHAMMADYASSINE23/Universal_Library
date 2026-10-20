import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";

const Page = async ({ params }: { params: { id: string } }) => {
    const id = (await params).id;

    // Book IDs are UUIDs in the database. Reject stale or malformed links
    // before sending them to PostgreSQL, where an ID like "1" raises 22P02.
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      notFound();
    }

    const session = await auth();

    const [bookDetails] = await db 
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1) as Book[];

    if (!bookDetails) notFound();

    return (
        <>
          <BookOverview {...bookDetails} userId={session?.user?.id as string} />

          <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>

            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>

            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              </div>
          </section>
        </div>

        {/*  SIMILAR*/}
      </div>
    </>
  );
};
export default Page;
