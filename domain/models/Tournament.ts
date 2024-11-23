import { Player } from "./Player";
import { Round } from "./Round";

export type Tournament = {
  id: string;
  name: string;
  courts: number;
  winnerId: string | null;
  couples: {
    id: string;
    player1Id: string;
    player2Id: string;
    tournamentId: string;
    player1: Player;
    player2: Player;
  }[];
  rounds: Round[];
  isFinished: boolean;
  currentRound: number;
  createdAt: string;
};
