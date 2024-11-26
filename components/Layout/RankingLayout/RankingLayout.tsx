import { appRoutes } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function RankingLayout({ children }: AdminLayoutProps) {
  return (
    <main className="min-h-[100vh] bg-black p-8 text-white">
      <nav className="flex items-center justify-center">
        <Link href={appRoutes.ranking.home}>
          <Image
            src="/img/hack-logo.png"
            alt="Hack Padel Logo"
            width={120}
            height={150}
          />
        </Link>
      </nav>
      {children}
    </main>
  );
}
