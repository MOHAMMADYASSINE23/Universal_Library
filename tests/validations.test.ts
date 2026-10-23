import test from "node:test";
import assert from "node:assert/strict";
import { signInSchema, signUpSchema, bookSchema, bookReviewSchema } from "../lib/validations";

test("sign-up accepts valid details and trims name/email", () => {
  const result = signUpSchema.safeParse({
    fullName: "  Library Reader  ",
    email: " reader@example.com ",
    password: "strong-pass-123",
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.fullName, "Library Reader");
    assert.equal(result.data.email, "reader@example.com");
  }
});

test("sign-up rejects invalid email and passwords outside the allowed length", () => {
  assert.equal(signUpSchema.safeParse({
    fullName: "Reader Name",
    email: "not-an-email",
    password: "short",
  }).success, false);

  assert.equal(signUpSchema.safeParse({
    fullName: "Reader Name",
    email: "reader@example.com",
    password: "p".repeat(129),
  }).success, false);
});

test("sign-up rejects excessively long names", () => {
  assert.equal(signUpSchema.safeParse({
    fullName: "A".repeat(256),
    email: "reader@example.com",
    password: "strong-pass-123",
  }).success, false);
});

test("sign-in rejects malformed credentials and passwords over the limit", () => {
  assert.equal(signInSchema.safeParse({ email: "invalid", password: "password123" }).success, false);
  assert.equal(signInSchema.safeParse({ email: "reader@example.com", password: "x" }).success, false);
  assert.equal(signInSchema.safeParse({
    email: "reader@example.com",
    password: "p".repeat(129),
  }).success, false);
});

test("book schema rejects invalid copy counts and ratings", () => {
  const invalidBook = {
    title: "Example Book",
    description: "A sufficiently long description for a test book.",
    author: "Test Author",
    genre: "Fiction",
    rating: 6,
    totalCopies: 0,
    coverUrl: "https://ik.imagekit.io/example/cover.png",
    coverColor: "#AABBCC",
    videoUrl: "example/video.mp4",
    summary: "A sufficiently long summary for testing.",
  };
  assert.equal(bookSchema.safeParse(invalidBook).success, false);
});

test("book schema accepts valid book metadata", () => {
  const validBook = {
    title: "Example Book",
    description: "A sufficiently long description for a test book.",
    author: "Test Author",
    genre: "Fiction",
    rating: 5,
    totalCopies: "3",
    coverUrl: "https://ik.imagekit.io/example/cover.png",
    coverColor: "#AABBCC",
    videoUrl: "example/video.mp4",
    summary: "A sufficiently long summary for testing.",
  };
  const result = bookSchema.safeParse(validBook);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.totalCopies, 3);
});

test("book review requires a UUID, rating from 1 to 5, and a useful review", () => {
  assert.equal(bookReviewSchema.safeParse({
    bookId: "not-a-uuid",
    rating: 5,
    review: "This book was genuinely useful and enjoyable.",
  }).success, false);
  assert.equal(bookReviewSchema.safeParse({
    bookId: "550e8400-e29b-41d4-a716-446655440000",
    rating: 6,
    review: "This book was genuinely useful and enjoyable.",
  }).success, false);
  assert.equal(bookReviewSchema.safeParse({
    bookId: "550e8400-e29b-41d4-a716-446655440000",
    rating: 5,
    review: "This book was genuinely useful and enjoyable.",
  }).success, true);
});

test("book review validates the trimmed review length", () => {
  const bookId = "550e8400-e29b-41d4-a716-446655440000";

  assert.equal(bookReviewSchema.safeParse({
    bookId,
    rating: 5,
    review: "         ",
  }).success, false);

  const result = bookReviewSchema.safeParse({
    bookId,
    rating: 5,
    review: "  This review has enough useful detail.  ",
  });

  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.review, "This review has enough useful detail.");
});
