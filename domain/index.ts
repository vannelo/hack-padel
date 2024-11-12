import { TournamentService } from "./services/TournamentService";
import { ITournamentService } from "./interfaces/ITournamentService";

export const tournamentService: ITournamentService = new TournamentService();
