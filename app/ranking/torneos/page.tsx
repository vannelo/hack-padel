import { Suspense } from "react";

import TableHeader from "@/components/Table/TableHeader/TableHeader";
import TableLoader from "@/components/Table/TableLoader/TableLoader";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import Divider from "@/components/UI/Divider/Divider";

export const revalidate = 0;

export default function Torneos() {
  return (
    <>
      <TableHeader title="Torneos" />
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <TournamentListWrapper />
      </Suspense>
    </>
  );
}
