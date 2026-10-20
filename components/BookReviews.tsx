"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { submitBookReview } from "@/lib/actions/review";

type Review = {
  id: string;
  reviewer: string;
  rating: number;
  review: string;
  createdAt: string;
};

type Props = {
  bookId: string;
  reviews: Review[];
  averageRating: number | null;
  reviewCount: number;
  canReview: boolean;
  initialReview?: { rating: number; review: string };
};

const Stars = ({ rating, interactive = false, onChange, label = "" }: {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  label?: string;
}) => (
  <div className="flex items-center gap-1" aria-label={label || `${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((value) => {
      const star = <Star className={`size-5 ${value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />;
      return interactive ? (
        <button key={value} type="button" onClick={() => onChange?.(value)} aria-label={`Rate ${value} out of 5`} aria-pressed={rating === value}>
          {star}
        </button>
      ) : <span key={value}>{star}</span>;
    })}
  </div>
);

const BookReviews = ({ bookId, reviews, averageRating, reviewCount, canReview, initialReview }: Props) => {
  const [rating, setRating] = useState(initialReview?.rating ?? 5);
  const [review, setReview] = useState(initialReview?.review ?? "");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitBookReview({ bookId, rating, review });
      if (!result.success) {
        toast({ title: "Review not saved", description: result.message, variant: "destructive" });
        return;
      }
      toast({ title: "Review saved", description: "Thanks for sharing your experience with other readers." });
      router.refresh();
    } catch {
      toast({ title: "Review not saved", description: "Please try again in a moment.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 rounded-2xl border border-white/10 bg-dark-300 p-6 sm:p-8" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Reader community</p>
          <h2 id="reviews-heading" className="mt-2 font-bebas-neue text-4xl text-light-100">Reader Reviews</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-white">{averageRating === null ? "New" : averageRating.toFixed(1)}</span>
          <div><Stars rating={averageRating ?? 0} /><p className="mt-1 text-sm text-light-200">{reviewCount} {reviewCount === 1 ? "review" : "reviews"}</p></div>
        </div>
      </div>

      {canReview ? (
        <form onSubmit={onSubmit} className="mt-7 rounded-xl bg-dark-400/70 p-5">
          <label className="text-sm font-semibold text-light-100">Your rating</label>
          <div className="mt-2"><Stars rating={rating} interactive onChange={setRating} label="Choose a star rating" /></div>
          <label htmlFor="book-review" className="mt-5 block text-sm font-semibold text-light-100">Your review</label>
          <Textarea id="book-review" value={review} onChange={(event) => setReview(event.target.value)} minLength={10} maxLength={1200} required rows={4} placeholder="What did you think of this book?" className="mt-2 border-white/10 bg-dark-300 text-white placeholder:text-light-500" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-light-200">Verified readers only | {review.length}/1200</p>
            <Button type="submit" disabled={submitting || review.trim().length < 10} className="bg-primary text-dark-100 hover:bg-primary/90">
              {submitting ? "Saving..." : initialReview ? "Update Review" : "Post Review"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-6 rounded-xl bg-dark-400/70 p-4 text-sm text-light-200">Borrow this book to unlock a verified reader review.</p>
      )}

      <div className="mt-7 space-y-4">
        {reviews.map((item) => (
          <article key={item.id} className="rounded-xl border border-white/10 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="font-semibold text-white">{item.reviewer}</p><p className="mt-1 text-xs text-light-200">Verified reader | {item.createdAt}</p></div>
              <Stars rating={item.rating} />
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-light-100">{item.review}</p>
          </article>
        ))}
        {!reviews.length && <p className="py-5 text-center text-sm text-light-200">No reviews yet. Be the first verified reader to share one.</p>}
      </div>
    </section>
  );
};

export default BookReviews;
