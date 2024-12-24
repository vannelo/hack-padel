import { v4 as uuidv4 } from "uuid";

import { Couple } from "../models/Couple";
import { Match } from "../models/Match";
import { Round } from "../models/Round";
import { Tournament } from "../models/Tournament";
import { TournamentRepository } from "../repositories/TournamentRepository";

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
    console.log("Ending round", roundId);
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
      // No more rounds => fully finish the tournament:
      await this.finishTournament(tournamentId);
    }

    // Fetch and log the updated tournament state
    await this.getTournamentById(tournamentId);
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
    console.log("finishing tournament 4");
    const tournament = await this.getTournamentById(tournamentId);
    if (!tournament) throw new Error("Tournament not found");

    // 0. Defensive check: If already finished, return immediately
    if (tournament.isFinished) {
      console.log("Tournament already finished, skipping awarding points");
      return tournament;
    }
    // 1. Calculate total points for each couple
    const couplePointsMap = this.calculateCouplePoints(tournament);

    // 2. Add each couple's total points to both players of that couple
    for (const [coupleId, totalPoints] of couplePointsMap.entries()) {
      console.log("finishing tournament 5");
      // Find the couple details in the tournament to get player1 and player2
      const couple = tournament.couples.find((c) => c.id === coupleId);
      if (!couple) continue;

      // Update each player's points in the DB
      await this.tournamentRepository.updatePlayerPoints(
        couple.player1Id,
        totalPoints,
      );
      await this.tournamentRepository.updatePlayerPoints(
        couple.player2Id,
        totalPoints,
      );
    }

    // 3. (Optional) Determine the winner for the tournament if you want to store it
    const winners = this.calculateWinners(tournament);
    // If you want to store the winning couple in the tournament table:
    if (winners?.id) {
      await this.tournamentRepository.updateTournamentWinner(
        tournamentId,
        winners.id,
      );
    }

    // 4. Mark the tournament as finished
    await this.tournamentRepository.updateTournamentStatus(tournamentId, true);

    // Return the updated tournament with final info
    const updatedTournament = await this.getTournamentById(tournamentId);
    if (!updatedTournament) {
      throw new Error("Tournament not found after finishing");
    }
    return updatedTournament;
  }

  private calculateWinners(tournament: Tournament) {
    // Example: Determine the couple with the most wins or highest points
    const results = tournament.rounds
      .flatMap((round) => round.matches)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, match) => {
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

  private calculateCouplePoints(tournament: Tournament): Map<string, number> {
    const couplePointsMap = new Map<string, number>();

    // Go through all rounds and matches
    tournament.rounds.forEach((round: Round) => {
      round.matches.forEach((match: Match) => {
        if (match.couple1Score != null) {
          const prevPoints = couplePointsMap.get(match.couple1Id) || 0;
          couplePointsMap.set(match.couple1Id, prevPoints + match.couple1Score);
        }
        if (match.couple2Score != null) {
          const prevPoints = couplePointsMap.get(match.couple2Id) || 0;
          couplePointsMap.set(match.couple2Id, prevPoints + match.couple2Score);
        }
      });
    });

    return couplePointsMap;
  }
}
