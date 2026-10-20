"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Session } from "next-auth";

const Header = ({session} : {session?: Session | null}) => {
  const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        <li>
         <Link href="/library" className={cn("text-base cursor-pointer capitalize", pathname === "/library" ? "text-light-200" : "text-light-100",)} > Library</Link>
        </li>
        <li>
          <Link href="/admin" className={cn("text-base cursor-pointer capitalize", pathname.startsWith("/admin") || pathname.startsWith("/dashboard") ? "text-light-200" : "text-light-100")}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/my-profile"
            aria-label={`Open ${session?.user?.name || "your"} profile`}
            title={session?.user?.name || "Your profile"}
            className="group inline-flex rounded-full outline-none ring-offset-2 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Avatar className="size-11 border-2 border-primary/70 bg-dark-300 shadow-lg shadow-black/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-amber-300 text-sm font-bold text-dark-100">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
          </li>
      </ul>
    </header>
  );
};

export default Header;
