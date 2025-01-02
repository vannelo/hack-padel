import { getAllPlayers } from "@/app/actions/playerActions";

import RankingTable from "./RankingTable";

export default async function RankingTableWrapper() {
  const players = await getAllPlayers();
  return <RankingTable players={players} />;
}
