CREATE TABLE "book_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_reviews_rating_check" CHECK ("rating" BETWEEN 1 AND 5)
);--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;--> statement-breakpoint
ALTER TABLE "book_reviews" ADD CONSTRAINT "book_reviews_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE ON UPDATE NO ACTION;--> statement-breakpoint
CREATE UNIQUE INDEX "book_reviews_user_book_unique" ON "book_reviews" USING btree ("user_id","book_id");--> statement-breakpoint
CREATE INDEX "book_reviews_book_id_idx" ON "book_reviews" USING btree ("book_id");
