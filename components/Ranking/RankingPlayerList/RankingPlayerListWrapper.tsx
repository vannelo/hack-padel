import { getAllPlayers } from "@/app/actions/playerActions";

import RankingPlayerList from "./RankingPlayerList";

export default async function RankingListWrapper() {
  const players = await getAllPlayers();
  return <RankingPlayerList players={players} />;
}
