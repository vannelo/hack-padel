import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import PlayerListWrapper from "@/components/Player/PlayerList/PlayerListWrapper";
import Divider from "@/components/UI/Divider/Divider";

export const revalidate = 0;

export default function AdminJugadores() {
  return (
    <>
      <div className="flex w-full justify-between">
        <h2 className="text-2xl font-bold text-white">Lista de jugadores</h2>
        <PlayerCreation />
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <PlayerListWrapper />
      </Suspense>
    </>
  );
}
