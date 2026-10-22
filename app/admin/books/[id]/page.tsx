import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import BookForm from "@/components/admin/forms/BookForm";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) notFound();
  const [book] = await db.select().from(books).where(eq(books.id, id)).limit(1);
  if (!book) notFound();

  return <>
    <Button asChild variant="outline" className="mb-8"><Link href="/admin/books">Back to Books</Link></Button>
    <section className="w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8">
      <h1 className="mb-8 text-xl font-semibold text-dark-400">Edit Book</h1>
      <BookForm type="update" {...book} />
    </section>
  </>;
};

export default Page;
