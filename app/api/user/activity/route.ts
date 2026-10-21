import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const [user] = await db
      .select({ lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user && user.lastActivityDate !== today) {
      await db
        .update(users)
        .set({ lastActivityDate: today })
        .where(eq(users.id, session.user.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not update user activity", error);
    return NextResponse.json({ error: "Could not update activity." }, { status: 500 });
  }
}
