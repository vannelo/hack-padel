import { Suspense } from "react";

import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import PlayerListWrapper from "@/components/Player/PlayerList/PlayerListWrapper";
import TableHeader from "@/components/Table/TableHeader/TableHeader";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export const revalidate = 0;

export default function AdminJugadores() {
  return (
    <>
      <TableHeader title="Lista de jugadores">
        <PlayerCreation />
      </TableHeader>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <PlayerListWrapper />
      </Suspense>
    </>
  );
}
