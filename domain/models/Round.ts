import { Match } from "./Match";

export interface Round {
  id: string;
  tournamentId: string;
  matches: Match[];
  isActive: boolean;
  roundNumber: number; // Added roundNumber
}
