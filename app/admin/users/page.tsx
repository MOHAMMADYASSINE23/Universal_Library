import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { asc } from "drizzle-orm";

const Page = async () => {
  const allUsers = await db.select({ id: users.id, name: users.fullName, email: users.email, status: users.status, role: users.role, createdAt: users.createdAt }).from(users).orderBy(asc(users.fullName));

  return <section className="rounded-2xl bg-white p-7">
    <h1 className="text-xl font-semibold text-dark-400">All Users</h1>
    <p className="mt-1 text-sm text-slate-500">{allUsers.length} registered users</p>
    <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
      <thead className="border-b text-slate-500"><tr><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Account</th><th className="py-3 pr-4">Role</th><th className="py-3">Joined</th></tr></thead>
      <tbody className="divide-y">{allUsers.map((user) => <tr key={user.id}>
        <td className="py-4 pr-4 font-medium text-dark-400">{user.name}</td><td className="py-4 pr-4 text-slate-600">{user.email}</td>
        <td className="py-4 pr-4 text-slate-600">{user.status ?? "PENDING"}</td><td className="py-4 pr-4 text-slate-600">{user.role ?? "USER"}</td>
        <td className="py-4 text-slate-600">{user.createdAt?.toLocaleDateString() ?? "—"}</td>
      </tr>)}</tbody>
    </table></div>
  </section>;
};

export default Page;
