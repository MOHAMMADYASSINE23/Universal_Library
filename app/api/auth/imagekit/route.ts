import ImageKit from "imagekit";
import config from "@/lib/config";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const {
  env: {
    imagekit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Administrator access required." }, { status: 403 });
  }

  return NextResponse.json(imagekit.getAuthenticationParameters());
}
