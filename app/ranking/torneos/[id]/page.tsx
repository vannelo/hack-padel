import { notFound } from "next/navigation";

import { getTournamentById } from "@/app/actions/tournamentActions";
import TournamentView from "@/components/Tournament/TournamentView/TournamentView";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const tournament = await getTournamentById((await params).id);

  if (!tournament) {
    notFound();
  }

  return <TournamentView initialTournament={tournament} />;
}
