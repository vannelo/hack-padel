import { Tournament } from "../models/Tournament";
import { TournamentRepository } from "../repositories/TournamentRepository";
import { Couple } from "../models/Couple";
import { Round } from "../models/Round";
import { Match } from "../models/Match";
import { v4 as uuidv4 } from "uuid";

export class TournamentService {
  private tournamentRepository = new TournamentRepository();

  async createTournament(
    name: string,
    courts: number,
    couples: Couple[],
  ): Promise<Tournament> {
    console.log("TournamentService.createTournament called with:", {
      name,
      courts,
      couples,
    });

    if (!couples || couples.length < 4) {
      throw new Error("At least 4 couples are required to create a tournament");
    }

    const rounds = this.generateRounds(couples, courts);
    return this.tournamentRepository.createTournament(
      name,
      courts,
      couples,
      rounds,
    );
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    return this.tournamentRepository.getTournamentById(id);
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return this.tournamentRepository.getAllTournaments();
  }

  async updateMatchResults(
    tournamentId: string,
    roundId: string,
    matchResults: {
      [key: string]: { couple1Score: number; couple2Score: number };
    },
  ): Promise<void> {
    console.log("Updating match results:", {
      tournamentId,
      roundId,
      matchResults,
    });
    return this.tournamentRepository.updateMatchResults(
      tournamentId,
      roundId,
      matchResults,
    );
  }

  async endRound(tournamentId: string, roundId: string): Promise<void> {
    console.log("Starting endRound function:", { tournamentId, roundId });
    const tournament = await this.getTournamentById(tournamentId);
    if (!tournament) {
      console.error("Tournament not found:", tournamentId);
      throw new Error("Tournament not found");
    }

    console.log(
      "Tournament state before ending round:",
      JSON.stringify(tournament, null, 2),
    );

    const currentRound = tournament.rounds.find((r) => r.id === roundId);
    if (!currentRound) {
      console.error("Round not found:", roundId);
      throw new Error("Round not found");
    }

    console.log("Current round number:", currentRound.roundNumber);

    // Deactivate the current round
    await this.tournamentRepository.updateRoundStatus(roundId, false);
    console.log("Current round set to inactive");

    // Find the next round by roundNumber
    const nextRound = tournament.rounds.find(
      (round) => round.roundNumber === currentRound.roundNumber + 1,
    );

    if (nextRound) {
      // Activate the next round
      await this.tournamentRepository.updateRoundStatus(nextRound.id, true);
      await this.tournamentRepository.updateTournamentProgress(
        tournamentId,
        nextRound.roundNumber,
      );
      console.log("Moving to next round:", nextRound.roundNumber);
    } else {
      // No more rounds; mark the tournament as finished
      await this.tournamentRepository.updateTournamentStatus(
        tournamentId,
        true,
      );
      console.log("Tournament finished");
    }

    // Fetch and log the updated tournament state
    const updatedTournament = await this.getTournamentById(tournamentId);
    console.log(
      "Updated tournament state:",
      JSON.stringify(updatedTournament, null, 2),
    );
  }

  private generateRounds(couples: Couple[], courts: number): Round[] {
    console.log("generateRounds called with:", { couples, courts });

    if (!couples || couples.length === 0) {
      throw new Error("No couples provided for generating rounds");
    }

    const rounds: Round[] = [];
    const n = couples.length;
    const totalMatches = (n * (n - 1)) / 2; // Total number of unique matches

    // Generate all possible matches
    const allMatches: { couple1: Couple; couple2: Couple }[] = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        allMatches.push({
          couple1: couples[i],
          couple2: couples[j],
        });
      }
    }

    // Shuffle the matches to randomize them
    allMatches.sort(() => Math.random() - 0.5);

    const matchesPerRound = Math.min(courts, Math.floor(n / 2)); // Ensure matches per round doesn't exceed courts
    const totalRounds = Math.ceil(totalMatches / matchesPerRound);

    let matchIndex = 0;
    for (let roundNumber = 1; roundNumber <= totalRounds; roundNumber++) {
      const roundMatches: Match[] = [];
      const roundId = uuidv4();

      for (let i = 0; i < matchesPerRound && matchIndex < totalMatches; i++) {
        const matchInfo = allMatches[matchIndex];
        const matchId = uuidv4();

        roundMatches.push({
          id: matchId,
          roundId,
          couple1Id: matchInfo.couple1.id,
          couple1: matchInfo.couple1,
          couple2Id: matchInfo.couple2.id,
          couple2: matchInfo.couple2,
          couple1Score: 0,
          couple2Score: 0,
          court: i + 1,
        });

        matchIndex++;
      }

      rounds.push({
        id: roundId,
        tournamentId: "", // This will be set when the tournament is created
        matches: roundMatches,
        isActive: roundNumber === 1,
        roundNumber: roundNumber, // Assign the round number
      });
    }

    return rounds;
  }
}
