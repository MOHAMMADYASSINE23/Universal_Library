import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import Link from "next/link";

const Page = () => (
  <section className="space-y-6">
    <div>
      <h1 className="font-bebas-neue text-4xl text-light-100">Your profile</h1>
      <p className="mt-2 text-light-200">Open the dashboard to manage books and library information.</p>
    </div>
    <div className="flex flex-wrap gap-4">
      <Button asChild><Link href="/admin">Open Dashboard</Link></Button>
      <form action={async () => { "use server"; await signOut(); }}>
        <Button variant="outline">Logout</Button>
      </form>
    </div>
  </section>
);

export default Page;
