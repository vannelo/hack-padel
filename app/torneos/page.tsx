import Image from "next/image";
import TournamentCreation from "@/components/Tournament/TournamentCreation/TournamentCreation";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import Divider from "@/components/UI/Divider/Divider";

export default function Torneos() {
  return (
    <main className="flex min-h-[100vh] bg-black p-8">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full items-end justify-between">
          <h2 className="text-2xl font-bold text-white">Lista de torneos</h2>
          <TournamentCreation />
        </div>
        <Divider />
        <div className="w-full">
          <Suspense fallback={<TableLoader />}>
            <TournamentListWrapper />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
