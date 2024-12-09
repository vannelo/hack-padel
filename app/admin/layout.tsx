import AdminLayout from "@/components/Layout/AdminLayout/AdminLayout";
import AdminNav from "@/components/Layout/AdminNav/AdminNav";

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNav />
      <AdminLayout>{children}</AdminLayout>
    </>
  );
}
