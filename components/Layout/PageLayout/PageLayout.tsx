import { ReactNode } from "react";

import Nav from "../Nav/Nav";

interface PageLayoutProps {
  isAdmin?: boolean;
  children: ReactNode;
}

export default function PageLayout({ isAdmin, children }: PageLayoutProps) {
  return (
    <main className="min-h-[100vh] bg-black px-8 py-4">
      <Nav isAdmin={isAdmin} />
      {children}
    </main>
  );
}
