import { appRoutes } from "@/utils/constants";
import Link from "next/link";
import { ReactNode } from "react";
import HackPadelLogo from "../HackPadelLogo/HackPadelLogo";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function RankingLayout({ children }: AdminLayoutProps) {
  return (
    <main className="min-h-[100vh] bg-black p-8 text-white">
      <nav className="flex items-center justify-center">
        <Link href={appRoutes.ranking.home}>
          <HackPadelLogo width={120} height={150} />
        </Link>
      </nav>
      {children}
    </main>
  );
}
