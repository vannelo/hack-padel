import { getAllTournaments } from "@/app/actions/tournamentActions";
import TournamentList from "./TournamentList";

export default async function TournamentListWrapper() {
  const tournaments = await getAllTournaments();
  return <TournamentList tournaments={tournaments} />;
}
