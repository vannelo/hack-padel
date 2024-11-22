import Image from "next/image";
import TournamentCreation from "@/components/Tournament/TournamentCreation/TournamentCreation";
import TournamentListWrapper from "@/components/Tournament/TournamentList/TournamentListWrapper";
import { Suspense } from "react";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

export default function Torneos() {
  return (
    <main className="flex min-h-[100vh] bg-black p-8">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-between">
          <Image
            src="/img/hack-logo.png"
            alt="Hack Padel Logo"
            width={200}
            height={150}
          />
          <TournamentCreation />
        </div>
        <div className="mt-8 w-full">
          <Suspense fallback={<TableLoader />}>
            <TournamentListWrapper />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
