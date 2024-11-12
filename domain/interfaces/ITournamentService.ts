import { Tournament } from "../models/Tournament";
import { Couple } from "../models/Couple";
import { Match } from "../models/Match";

export interface ITournamentService {
  createTournament(
    name: string,
    couples: Couple[],
    numberOfCourts: number,
  ): Tournament;
  generateMatches(tournament: Tournament, numberOfCourts: number): Match[];
  calculateLeader(tournament: Tournament): Couple | undefined;
  updateScores(tournament: Tournament, matchResults: Match[]): Tournament;
  calculateWinners(tournament: Tournament): Couple[];
}
