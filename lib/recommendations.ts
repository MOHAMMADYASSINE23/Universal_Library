import { db } from "@/database/drizzle";
import { bookReviews, books, borrowRecords } from "@/database/schema";
import { and, desc, eq, gt, inArray } from "drizzle-orm";

export type BookRecommendation = {
  book: Book;
  reason: string;
};

const genresOf = (value: string) => value
  .split(/[,/&]/)
  .map((genre) => genre.trim())
  .filter(Boolean);

export const getBookRecommendations = async (userId: string) => {
  const [readingHistory, myReviews, borrowHistory, availableBooks] = await Promise.all([
    db.select({ bookId: books.id, genre: books.genre })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(and(
        eq(borrowRecords.userId, userId),
        inArray(borrowRecords.status, ["BORROWED", "RETURNED"]),
      )),
    db.select({ bookId: bookReviews.bookId, rating: bookReviews.rating })
      .from(bookReviews)
      .where(eq(bookReviews.userId, userId)),
    db.select({ bookId: borrowRecords.bookId })
      .from(borrowRecords)
      .where(and(
        eq(borrowRecords.userId, userId),
        inArray(borrowRecords.status, ["PENDING", "BORROWED", "RETURNED"]),
      )),
    db.select().from(books)
      .where(gt(books.availableCopies, 0))
      .orderBy(desc(books.rating), desc(books.createdAt)),
  ]);

  const excludedBookIds = new Set(borrowHistory.map(({ bookId }) => bookId));
  const ratingsByBook = new Map(myReviews.map(({ bookId, rating }) => [bookId, rating]));
  const genreScores = new Map<string, { label: string; score: number }>();

  for (const item of readingHistory) {
    const personalRating = ratingsByBook.get(item.bookId);
    const preferenceWeight = personalRating === undefined ? 1 : personalRating - 3;
    for (const genre of genresOf(item.genre)) {
      const key = genre.toLocaleLowerCase();
      const existing = genreScores.get(key);
      genreScores.set(key, {
        label: existing?.label ?? genre,
        score: (existing?.score ?? 0) + preferenceWeight,
      });
    }
  }

  const rankedBooks = availableBooks
    .filter((book) => !excludedBookIds.has(book.id))
    .map((book) => {
      const matches = genresOf(book.genre)
        .map((genre) => genreScores.get(genre.toLocaleLowerCase()))
        .filter((preference): preference is { label: string; score: number } => Boolean(preference && preference.score > 0))
        .sort((a, b) => b.score - a.score);
      const topMatch = matches[0];
      return {
        book: book as Book,
        reason: topMatch ? `Picked for your interest in ${topMatch.label}` : "Popular and available now",
        score: (topMatch?.score ?? 0) * 2 + book.rating,
        genreMatchScore: topMatch?.score ?? 0,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  const personalized = rankedBooks.some((item) => item.genreMatchScore > 0);
  const recommendations = rankedBooks.map(({ book, reason }) => ({ book, reason }));

  return { recommendations, personalized };
};
