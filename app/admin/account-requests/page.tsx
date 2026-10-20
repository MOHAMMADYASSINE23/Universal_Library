import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, asc } from "drizzle-orm";
import { updateAccountStatus } from "@/lib/admin/actions/dashboard";

const Page = async () => {
  const requests = await db.select({ id: users.id, name: users.fullName, email: users.email, createdAt: users.createdAt })
    .from(users).where(eq(users.status, "PENDING")).orderBy(asc(users.createdAt));

  return <section className="rounded-2xl bg-white p-7">
    <h1 className="text-xl font-semibold text-dark-400">Account Requests</h1>
    <p className="mt-1 text-sm text-slate-500">Review new library account applications.</p>
    <div className="mt-6 space-y-3">{requests.map((user) => <article key={user.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4">
      <div><p className="font-semibold text-dark-400">{user.name}</p><p className="text-sm text-slate-500">{user.email}</p><p className="mt-1 text-xs text-slate-400">Applied {user.createdAt?.toLocaleDateString() ?? "recently"}</p></div>
      <div className="flex gap-2">
        <form action={updateAccountStatus.bind(null, user.id, "APPROVED")}><button className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white">Approve</button></form>
        <form action={updateAccountStatus.bind(null, user.id, "REJECTED")}><button className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white">Reject</button></form>
      </div>
    </article>)}
    {!requests.length && <p className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">There are no pending account requests.</p>}
    </div>
  </section>;
};

export default Page;
