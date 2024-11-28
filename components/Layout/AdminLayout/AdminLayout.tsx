import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <main className="min-h-[100vh] bg-black px-8 py-4">{children}</main>;
}
