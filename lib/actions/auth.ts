"use server";

import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const signInWithCredentials = async ( params: Pick<AuthCredentials, "email" | "password">,) => {
     const { email, password } = params;

    
    try{
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (result?.error) {
            return { success: false, error: result.error };
        }
        return { success: true };
    } catch (error) {
        console.log(error, "signin error");
        return { success: false, error: "sigin error"};
    }
};

export const signUp = async (params: AuthCredentials) => {
     const { fullName, email, password } = params;

     console.log("SignUp called with:", { fullName, email });

     // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
     // const { success } = await ratelimit.limit(ip);

     // if (!success) return redirect("/too-fast");

     const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

     console.log("Existing user check:", existingUser.length);

     if (existingUser.length > 0) {
        console.log("User already exists");
        return { success: false, error: "User already exists" };
     }

     const hashedPassword = await hash(password, 10);

     try{
        console.log("Inserting user");
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
        });
        console.log("User inserted successfully");

        try {
            await workflowClient.trigger({
                url: `${config.env.prodApiEndpoint}/api/auth/workflows/onboarding`,
                body: { email, fullName,},
            });
            console.log("Workflow triggered");
        } catch (error) {
            console.log("Workflow trigger failed:", error);
            // Don't fail signup if workflow fails
        }

        console.log("Calling signInWithCredentials");
        await signInWithCredentials({ email, password });
        console.log("Sign in successful");

        return { success: true };
     } catch (error) {
        console.log(error, "signup error");
        return { success: false, error: "signup error"};
     }
     }
