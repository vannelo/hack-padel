import { notFound } from "next/navigation";

import { getTournamentById } from "@/app/actions/tournamentActions";
import TournamentDetails from "@/components/Tournament/TournamentDetails/TournamentDetails";

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

  return <TournamentDetails initialTournament={tournament} />;
}
