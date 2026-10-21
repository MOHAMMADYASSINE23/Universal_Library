"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";
import ratelimit from "@/lib/ratelimit";
import { signUpSchema, signInSchema } from "@/lib/validations";

const getClientIp = async () => {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  return requestHeaders.get("x-real-ip") || forwardedFor?.split(",")[0]?.trim() || "unknown";
};

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const validated = signInSchema.safeParse({
    email: typeof params?.email === "string" ? params.email.trim().toLowerCase() : "",
    password: typeof params?.password === "string" ? params.password : "",
  });

  if (!validated.success) {
    return { success: false, error: "Enter a valid email and password." };
  }

  try {
    const { success: withinLimit } = await ratelimit.limit(`signin:${await getClientIp()}`);
    if (!withinLimit) {
      return { success: false, error: "Too many sign-in attempts. Please wait a minute and try again." };
    }

    const result = await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Email or password is incorrect, or your account is not available." };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign-in failed", error);
    return { success: false, error: "Could not sign in right now. Please try again." };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const validated = signUpSchema.safeParse({
    fullName: typeof params?.fullName === "string" ? params.fullName.trim() : "",
    email: typeof params?.email === "string" ? params.email.trim().toLowerCase() : "",
    password: typeof params?.password === "string" ? params.password : "",
  });

  if (!validated.success) {
    return { success: false, error: "Enter a valid name, email address, and password of at least 8 characters." };
  }

  const { fullName, email, password } = validated.data;

  try {
    const { success: withinLimit } = await ratelimit.limit(`signup:${await getClientIp()}`);
    if (!withinLimit) {
      return { success: false, error: "Too many account requests. Please wait a minute and try again." };
    }

    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = await hash(password, 10);

    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
    });

    try {
      await workflowClient.trigger({
        url: `${config.env.prodApiEndpoint}/api/auth/workflows/onboarding`,
        body: { email, fullName },
      });
    } catch (error) {
      console.error("Onboarding workflow could not be triggered", error);
    }

    const signInResult = await signInWithCredentials({ email, password });
    if (!signInResult.success) {
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign-up failed", error);
    return { success: false, error: "Could not create your account. Please try again." };
  }
};
