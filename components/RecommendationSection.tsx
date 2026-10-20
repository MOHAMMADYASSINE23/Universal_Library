import Link from "next/link";
import BookCard from "@/components/BookCard";
import type { BookRecommendation } from "@/lib/recommendations";

const RecommendationSection = ({ recommendations, personalized }: {
  recommendations: BookRecommendation[];
  personalized: boolean;
}) => (
  <section className="mt-24 rounded-3xl border border-white/10 bg-gradient-to-br from-dark-300 via-dark-300 to-[#25284a] p-6 sm:p-9">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{personalized ? "Made for your taste" : "Start exploring"}</p>
        <h2 className="mt-2 font-bebas-neue text-4xl text-light-100 sm:text-5xl">Picked for You</h2>
        <p className="mt-2 max-w-xl text-sm text-light-200">
          {personalized
            ? "Recommendations use your reading history and ratings. Each pick shows why it matches."
            : "Popular, available books to get your recommendations started."}
        </p>
      </div>
      <Link href="/library" className="text-sm font-semibold text-primary underline underline-offset-4">Explore all books</Link>
    </div>

    {recommendations.length ? (
      <ul className="book-list mt-7">
        {recommendations.map(({ book, reason }) => <BookCard key={book.id} {...book} recommendationReason={reason} />)}
      </ul>
    ) : (
      <p className="mt-7 rounded-xl bg-black/15 p-5 text-sm text-light-200">No new available books match right now. Check the library again when more titles are added.</p>
    )}
  </section>
);

export default RecommendationSection;
