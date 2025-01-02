import { Suspense } from "react";

import RankingTableWrapper from "@/components/Ranking/RankingTable/RankingTableWrapper";
import TableHeader from "@/components/Table/TableHeader/TableHeader";
import TableLoader from "@/components/Table/TableLoader/TableLoader";
import Divider from "@/components/UI/Divider/Divider";

export default function Jugadores() {
  return (
    <>
      <TableHeader title="Jugadores" />
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <RankingTableWrapper />
      </Suspense>
    </>
  );
}
