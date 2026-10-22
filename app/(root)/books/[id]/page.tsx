import React from "react";
import { db } from "@/database/drizzle";
import { bookReviews, books, borrowRecords, users } from "@/database/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import BookReviews from "@/components/BookReviews";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
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

    const [reviewRows, verifiedRecords] = await Promise.all([
      db.select({
        id: bookReviews.id,
        userId: bookReviews.userId,
        reviewer: users.fullName,
        rating: bookReviews.rating,
        review: bookReviews.review,
        createdAt: bookReviews.createdAt,
      }).from(bookReviews)
        .innerJoin(users, eq(bookReviews.userId, users.id))
        .where(eq(bookReviews.bookId, id))
        .orderBy(desc(bookReviews.createdAt)),
      session?.user?.id
        ? db.select({ id: borrowRecords.id }).from(borrowRecords)
          .where(and(
            eq(borrowRecords.userId, session.user.id),
            eq(borrowRecords.bookId, id),
            inArray(borrowRecords.status, ["BORROWED", "RETURNED"]),
          )).limit(1)
        : Promise.resolve([]),
    ]);
    const averageRating = reviewRows.length
      ? reviewRows.reduce((sum, item) => sum + item.rating, 0) / reviewRows.length
      : null;
    const ownReview = session?.user?.id
      ? reviewRows.find((item) => item.userId === session.user?.id)
      : undefined;

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

      <BookReviews
        bookId={id}
        reviews={reviewRows.map(({ id: reviewId, reviewer, rating, review, createdAt }) => ({
          id: reviewId,
          reviewer,
          rating,
          review,
          createdAt: createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        }))}
        averageRating={averageRating}
        reviewCount={reviewRows.length}
        canReview={verifiedRecords.length > 0}
        initialReview={ownReview ? { rating: ownReview.rating, review: ownReview.review } : undefined}
      />
    </>
  );
};
export default Page;
