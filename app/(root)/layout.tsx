import { ReactNode } from "react";
import Header from "@/components/Header";
import { Session } from "inspector/promises";
import { redirect } from "next/dist/server/api-utils";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={Session} />

        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;