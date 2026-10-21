import "next-auth";
import "next-auth/jwt";
import type { DefaultSession } from "next-auth";

type LibraryRole = "USER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role?: LibraryRole;
  }

  interface Session {
    user: {
      id: string;
      role: LibraryRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: LibraryRole;
  }
}
