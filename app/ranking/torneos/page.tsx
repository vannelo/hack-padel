import { Suspense } from "react";

import TableHeader from "@/components/Table/TableHeader/TableHeader";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

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
