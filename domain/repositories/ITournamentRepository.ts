import { Tournament } from "../models/Tournament";

export interface ITournamentRepository {
  createTournament(tournament: Tournament): Promise<Tournament>;
  getTournamentById(id: string): Promise<Tournament | null>;
  updateTournament(tournament: Tournament): Promise<Tournament>;
}
