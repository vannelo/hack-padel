import HackPadelLogo from "@/components/Layout/HackPadelLogo/HackPadelLogo";
import { appRoutes } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";

export default function RankingHome() {
  return (
    <div className="flex flex-col items-center pt-64">
      <HackPadelLogo />
      <h3 className="mt-4">Primera cancha de padel en Lindavista</h3>
      <div className="flex items-center justify-center">
        <Link href={appRoutes.ranking.players} className="p-2 text-primary">
          Jugadores
        </Link>
        |
        <Link href={appRoutes.ranking.tournaments} className="p-2 text-primary">
          Torneos
        </Link>
      </div>
    </div>
  );
}