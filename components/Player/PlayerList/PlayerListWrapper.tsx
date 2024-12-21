import { getAllPlayers } from "@/app/actions/playerActions";

import PlayerList from "./PlayerList";

export default async function PlayerListWrapper() {
  const players = await getAllPlayers();
  return <PlayerList players={players} />;
}
