import { Couple } from "./Couple";
import { Match } from "./Match";

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
