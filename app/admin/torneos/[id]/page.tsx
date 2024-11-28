import { getTournamentById } from "@/app/actions/tournamentActions";
import TournamentManagement from "@/components/Tournament/TournamentManagement/TournamentManagement";

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

  return <TournamentManagement initialTournament={tournament} isAdmin />;
}
