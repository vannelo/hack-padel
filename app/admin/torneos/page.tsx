import { Suspense } from "react";

import ListHeader from "@/components/Layout/ListHeader/ListHeader";
import TournamentCreation from "@/components/Tournament/TournamentCreation/TournamentCreation";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export const revalidate = 0;

export default function Torneos() {
  return (
    <>
      <ListHeader title="Lista de torneos">
        <TournamentCreation />
      </ListHeader>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <TournamentListWrapper isAdmin />
      </Suspense>
    </>
  );
}
