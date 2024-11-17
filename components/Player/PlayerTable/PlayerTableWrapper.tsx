import { getAllPlayers } from "@/app/actions/playerActions";
import PlayerTable from "./PlayerTable";

export default async function PlayerTableWrapper() {
  const players = await getAllPlayers();
  return <PlayerTable players={players} />;
}
