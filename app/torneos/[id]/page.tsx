import { getTournamentById } from "@/app/actions/tournamentActions";
import TournamentDetails from "@/components/Tournament/TournamentDetails/TournamentDetails";

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
    <div className="bg-black">
      <div className="container mx-auto bg-black px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Detalles del Torneo
        </h1>
        <TournamentDetails tournament={tournament} />
      </div>
    </div>
  );
}
