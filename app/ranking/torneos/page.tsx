import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import Divider from "@/components/UI/Divider/Divider";

export const revalidate = 0;

export default function Torneos() {
  return (
    <>
      <div className="flex w-full items-end justify-between">
        <h2 className="text-2xl font-bold text-white">Lista de torneos</h2>
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <TournamentListWrapper />
      </Suspense>
    </>
  );
}
