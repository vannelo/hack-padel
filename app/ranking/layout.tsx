import RankingNav from "@/components/Layout/RankingNav/RankingNav";

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RankingNav />
        {children}
      </body>
    </html>
  );
}
