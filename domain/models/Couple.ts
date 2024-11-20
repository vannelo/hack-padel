import { Player } from "./Player";

export interface Couple {
  id: string;
  player1Id: string;
  player1: Player;
  player2Id: string;
  player2: Player;
  tournamentId: string;
}
