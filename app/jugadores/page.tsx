import Image from "next/image";
import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import PlayerTable from "@/components/Player/PlayerTable/PlayerTable";
import { prisma } from "@/lib/prisma";
import { Player } from "@/domain/models/Player";

export default async function Home() {
  const players = await prisma.player.findMany();

  return (
    <main className="flex min-h-[100vh] items-center justify-center p-8">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-between">
          <Image
            src="/img/hack-logo.png"
            alt="Hack Padel Logo"
            width={200}
            height={150}
          />
          <PlayerCreation />
        </div>
        <div className="mt-8 w-full">
          <PlayerTable players={players as Player[]} />
        </div>
      </div>
    </main>
  );
}
