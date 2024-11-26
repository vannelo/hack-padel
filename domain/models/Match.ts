import { Couple } from "./Couple";

export interface Match {
  id: string;
  roundId: string;
  couple1Id: string;
  couple1: Couple;
  couple2Id: string;
  couple2: Couple;
  couple1Score: number;
  couple2Score: number;
  court: number;
}

export interface MatchResults {
  [key: string]: { couple1Score: number; couple2Score: number };
}
