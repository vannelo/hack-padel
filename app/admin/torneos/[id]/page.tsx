import { getTournamentById } from "@/app/actions/tournamentActions";
import TournamentDetails from "@/components/Tournament/TournamentDetails/TournamentDetails";
import Image from "next/image";

import { notFound } from "next/navigation";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const tournament = await getTournamentById(id);

  if (!tournament) {
    notFound();
  }

  return (
    <main className="flex min-h-[100vh] bg-black p-8">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center">
          <Image
            src="/img/hack-logo.png"
            alt="Hack Padel Logo"
            width={120}
            height={150}
          />
        </div>
        <div className="mt-8 w-full">
          <TournamentDetails tournament={tournament} />
        </div>
      </div>
    </main>
  );
}
