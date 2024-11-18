import { Couple, Match } from "@prisma/client";

export interface Tournament {
  id: string;
  name: string;
  numberOfCourts: number;
  couples: Couple[];
  matches: Match[];
  currentLeader?: Couple;
  currentMatchNumber: number;
  scores: Map<string, number>;
  winners?: Couple[];
}

export interface CreateTournamentInput {
  id: string;
  name: string;
  numberOfCourts: number;
  couples: {
    id: string;
    tournamentId: string;
    player1Id: string;
    player2Id: string;
  }[];
  matches: {
    tournamentId: string;
    id: string;
    couple1Id: string;
    couple2Id: string;
    couple1Score: number | null;
    couple2Score: number | null;
  }[];
  currentMatchNumber: number;
  scores: Map<string, number>;
}
