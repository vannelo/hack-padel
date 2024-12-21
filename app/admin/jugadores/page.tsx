import { Suspense } from "react";

import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import PlayerListWrapper from "@/components/Player/PlayerList/PlayerListWrapper";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export const revalidate = 0;

export default function AdminJugadores() {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="font-bold text-white md:text-2xl">Lista de jugadores</h2>
        <PlayerCreation />
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <PlayerListWrapper />
      </Suspense>
    </>
  );
}
