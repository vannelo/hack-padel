import Image from "next/image";
import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import PlayerTableWrapper from "@/components/Player/PlayerTable/PlayerTableWrapper";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export default function Jugadores() {
  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-black p-8">
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
          <Suspense fallback={<TableLoader />}>
            <PlayerTableWrapper />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
