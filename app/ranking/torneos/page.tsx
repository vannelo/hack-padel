import { Suspense } from "react";

import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import Divider from "@/components/UI/Divider/Divider";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export const revalidate = 0;

export default function Torneos() {
  return (
    <>
      <div className="flex w-full items-end justify-between">
        <h2 className="text-xl font-bold text-white md:text-2xl">
          Lista de torneos
        </h2>
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <TournamentListWrapper />
      </Suspense>
    </>
  );
}
