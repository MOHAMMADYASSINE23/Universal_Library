import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const requireAdmin = async () => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  // Check the database role, not just the JWT claim, so role changes take
  // effect immediately instead of leaving stale administrator access.
  const [account] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (account?.role !== "ADMIN") redirect("/");

  return session;
};
