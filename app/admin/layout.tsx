import AdminNav from "@/components/Layout/AdminNav/AdminNav";

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AdminNav />
        {children}
      </body>
    </html>
  );
}
