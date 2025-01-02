import { Suspense } from "react";

import PlayerCreation from "@/components/Player/PlayerCreation/PlayerCreation";
import PlayerTableWrapper from "@/components/Player/PlayerTable/PlayerTableWrapper";
import TableHeader from "@/components/Table/TableHeader/TableHeader";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/Table/TableLoader/TableLoader";

export const revalidate = 0;

export default function AdminJugadores() {
  return (
    <>
      <TableHeader title="Lista de jugadores">
        <PlayerCreation />
      </TableHeader>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <PlayerTableWrapper />
      </Suspense>
    </>
  );
}
