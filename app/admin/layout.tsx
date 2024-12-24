import PageLayout from "@/components/Layout/PageLayout/PageLayout";

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout isAdmin>{children}</PageLayout>;
}
