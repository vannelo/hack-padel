import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import Divider from "@/components/UI/Divider/Divider";
import RankingPlayerListWrapper from "@/components/Ranking/RankingPlayerList/RankingPlayerListWrapper";

export default function Jugadores() {
  return (
    <>
      <div className="flex w-full items-end justify-between">
        <h2 className="text-2xl font-bold text-white">Lista de jugadores</h2>
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <RankingPlayerListWrapper />
      </Suspense>
    </>
  );
}
