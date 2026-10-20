ALTER TYPE "public"."borrow_status" ADD VALUE IF NOT EXISTS 'PENDING';--> statement-breakpoint
ALTER TYPE "public"."borrow_status" ADD VALUE IF NOT EXISTS 'REJECTED';
