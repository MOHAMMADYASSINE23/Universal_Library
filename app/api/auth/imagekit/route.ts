import ImageKit from "imagekit";
import config from "@/lib/config";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const [account] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (account?.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Administrator access required." },
      { status: 403, headers: noStoreHeaders },
    );
  }

  return NextResponse.json(imagekit.getAuthenticationParameters(), {
    headers: noStoreHeaders,
  });
}
