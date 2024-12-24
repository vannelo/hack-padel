import { Suspense } from "react";

import RankingPlayerListWrapper from "@/components/Ranking/RankingPlayerList/RankingPlayerListWrapper";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export default function Jugadores() {
  return (
    <>
      <div className="flex w-full items-end justify-center">
        <h2 className="text-xl font-bold text-white md:text-2xl">Jugadores</h2>
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <RankingPlayerListWrapper />
      </Suspense>
    </>
  );
}
