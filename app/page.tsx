import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={300}
          height={150}
        />
        <h3 className="mt-4">Primera cancha de padel en Lindavista</h3>
        <div className="flex items-center justify-center">
          <Link href="/admin" className="p-2 text-primary">
            Admin
          </Link>
          |
          <Link href="/ranking/jugadores" className="p-2 text-primary">
            Ranking
          </Link>
          |
          <Link href="/ranking/torneos" className="p-2 text-primary">
            Torneos
          </Link>
        </div>
      </div>
    </div>
  );
}
