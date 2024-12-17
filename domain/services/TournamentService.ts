// @ts-nocheck

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
    return this.tournamentRepository.updateMatchResults(
      tournamentId,
      roundId,
      matchResults,
    );
  }

  async endRound(tournamentId: string, roundId: string): Promise<void> {
    const tournament = await this.getTournamentById(tournamentId);
    if (!tournament) {
      throw new Error("Tournament not found");
    }

    const currentRound = tournament.rounds.find((r) => r.id === roundId);
    if (!currentRound) {
      throw new Error("Round not found");
    }

    // Deactivate the current round
    await this.tournamentRepository.updateRoundStatus(roundId, false);

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
    } else {
      // No more rounds; mark the tournament as finished
      await this.tournamentRepository.updateTournamentStatus(
        tournamentId,
        true,
      );
    }

    // Fetch and log the updated tournament state
    const updatedTournament = await this.getTournamentById(tournamentId);
  }

  private generateRounds(couples: Couple[], courts: number): Round[] {
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

  async deleteTournament(id: string): Promise<void> {
    await this.tournamentRepository.deleteTournament(id);
  }

  async updateMatchScore(
    matchId: string,
    coupleNumber: number,
    score: number,
  ): Promise<void> {
    const updateData =
      coupleNumber === 1 ? { couple1Score: score } : { couple2Score: score };

    await this.tournamentRepository.updateMatch(matchId, updateData);
  }

  async finishTournament(tournamentId: string): Promise<Tournament> {
    const tournament = await this.getTournamentById(tournamentId);

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    const winners = this.calculateWinners(tournament);
    await this.tournamentRepository.updateTournamentStatus(tournamentId, true);

    // Optionally update winner information in the database if needed
    // e.g., await this.tournamentRepository.setWinners(tournamentId, winners);

    return await this.getTournamentById(tournamentId); // Fetch updated state
  }

  private calculateWinners(tournament: Tournament) {
    // Example: Determine the couple with the most wins or highest points
    const results = tournament.rounds
      .flatMap((round) => round.matches)
      .reduce((acc, match) => {
        if (match.couple1Score > match.couple2Score) {
          acc[match.couple1Id] = (acc[match.couple1Id] || 0) + 1;
        } else if (match.couple2Score > match.couple1Score) {
          acc[match.couple2Id] = (acc[match.couple2Id] || 0) + 1;
        }
        return acc;
      }, {});

    const winnerId = Object.keys(results).reduce((a, b) =>
      results[a] > results[b] ? a : b,
    );
    return tournament.couples.find((couple) => couple.id === winnerId);
  }

  async updateTournamentProgress(
    tournamentId: string,
    currentRound: number,
  ): Promise<void> {
    await this.tournamentRepository.updateTournamentProgress(
      tournamentId,
      currentRound,
    );
  }
}
