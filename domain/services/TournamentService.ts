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

    if (!couples || couples.length < 2) {
      throw new Error("At least 2 couples are required to create a tournament");
    }

    const rounds: Round[] = [];
    const n = couples.length;
    const totalRounds = n - 1; // In a round-robin, there are (n-1) rounds
    const matchesPerRound = n / 2;

    // Create a copy of the couples array to manipulate
    const couplesArray = [...couples];

    // If there's an odd number of couples, add a "bye" couple
    if (n % 2 !== 0) {
      couplesArray.push({
        id: "bye",
        player1: { name: "Bye" },
        player2: { name: "Bye" },
      } as Couple);
    }

    for (let round = 0; round < totalRounds; round++) {
      const roundId = uuidv4();
      const roundMatches: Match[] = [];

      for (let match = 0; match < matchesPerRound; match++) {
        const homeIndex = match;
        const awayIndex = couplesArray.length - 1 - match;

        if (
          couplesArray[homeIndex].id !== "bye" &&
          couplesArray[awayIndex].id !== "bye"
        ) {
          roundMatches.push({
            id: uuidv4(),
            roundId,
            couple1Id: couplesArray[homeIndex].id,
            couple1: couplesArray[homeIndex],
            couple2Id: couplesArray[awayIndex].id,
            couple2: couplesArray[awayIndex],
            couple1Score: 0,
            couple2Score: 0,
            court: (match % courts) + 1,
          });
        }
      }

      rounds.push({
        id: roundId,
        tournamentId: "", // This will be set when the tournament is created
        matches: roundMatches,
        isActive: round === 0, // First round is active by default
        roundNumber: round + 1,
      });

      // Rotate the array for the next round (keeping the first element fixed)
      const firstCouple = couplesArray[0];
      const secondCouple = couplesArray[1];
      for (let i = 1; i < couplesArray.length - 1; i++) {
        couplesArray[i] = couplesArray[i + 1];
      }
      couplesArray[couplesArray.length - 1] = secondCouple;
    }

    return rounds;
  }

  // ... other methods ...
}
