import TournamentCreation from "@/components/Tournament/TournamentCreation/TournamentCreation";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import Divider from "@/components/UI/Divider/Divider";

export const revalidate = 0;

export default function Torneos() {
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="font-bold text-white md:text-2xl">Lista de torneos</h2>
        <TournamentCreation />
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <TournamentListWrapper isAdmin />
      </Suspense>
    </>
  );
}
