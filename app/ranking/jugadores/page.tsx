import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import PlayerListWrapper from "@/components/Player/PlayerList/PlayerListWrapper";
import Divider from "@/components/UI/Divider/Divider";

export default function Jugadores() {
  return (
    <main className="flex min-h-[100vh] bg-black p-8">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-end justify-between">
          <h2 className="text-2xl font-bold text-white">Lista de jugadores</h2>
        </div>
        <Divider />
        <div className="w-full">
          <Suspense fallback={<TableLoader />}>
            <PlayerListWrapper />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
