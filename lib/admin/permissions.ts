import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const requireDashboardUser = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  return session;
};
