import TournamentTable from "./TournamentTable";
import { getAllTournaments } from "@/app/actions/tournamentActions";

export default async function TournamentTableWrapper() {
  const tournaments = await getAllTournaments();
  return <TournamentTable tournaments={tournaments} />;
}
