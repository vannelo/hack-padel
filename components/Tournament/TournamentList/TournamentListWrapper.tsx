import { getAllTournaments } from "@/app/actions/tournamentActions";
import TournamentList from "./TournamentList";

interface TournamentListWrapperProps {
  isAdmin?: boolean;
}

export default async function TournamentListWrapper({
  isAdmin = false,
}: TournamentListWrapperProps) {
  const tournaments = await getAllTournaments();
  return <TournamentList tournaments={tournaments} isAdmin={isAdmin} />;
}
