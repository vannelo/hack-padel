import TournamentCreation from "@/components/Tournament/TournamentCreation/TournamentCreation";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";
import Divider from "@/components/UI/Divider/Divider";

export default function Torneos() {
  return (
    <main className="min-h-[100vh] bg-black p-8">
      <div className="flex w-full justify-between">
        <h2 className="text-2xl font-bold text-white">Lista de torneos</h2>
        <TournamentCreation />
      </div>
      <Divider />
      <Suspense fallback={<TableLoader />}>
        <TournamentListWrapper isAdmin />
      </Suspense>
    </main>
  );
}
