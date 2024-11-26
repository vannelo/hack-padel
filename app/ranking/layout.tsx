import RankingLayout from "@/components/Layout/RankingLayout/RankingLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RankingLayout>{children}</RankingLayout>
      </body>
    </html>
  );
}
