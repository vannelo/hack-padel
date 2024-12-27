import { Suspense } from "react";

import RankingPlayerListWrapper from "@/components/Ranking/RankingPlayerList/RankingPlayerListWrapper";
import TableHeader from "@/components/Table/TableHeader/TableHeader";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export default function Jugadores() {
  return (
    <>
      <TableHeader title="Jugadores" />
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <RankingPlayerListWrapper />
      </Suspense>
    </>
  );
}
