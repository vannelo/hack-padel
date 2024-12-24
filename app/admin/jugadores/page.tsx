import { Suspense } from "react";

import ListHeader from "@/components/Layout/ListHeader/ListHeader";
import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import PlayerListWrapper from "@/components/Player/PlayerList/PlayerListWrapper";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export const revalidate = 0;

export default function AdminJugadores() {
  return (
    <>
      <ListHeader title="Lista de jugadores">
        <PlayerCreation />
      </ListHeader>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <PlayerListWrapper />
      </Suspense>
    </>
  );
}
