import HackPadelLogo from "@/components/Layout/HackPadelLogo/HackPadelLogo";
import Link from "next/link";

export default function Admin() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center bg-black py-64 text-white">
      <HackPadelLogo />
      <h3 className="mt-4">Admin</h3>
      <div className="flex items-center justify-center">
        <Link href="/admin/jugadores" className="p-2 text-primary">
          Jugadores
        </Link>
        |
        <Link href="/admin/torneos" className="p-2 text-primary">
          Torneos
        </Link>
      </div>
    </div>
  );
}
