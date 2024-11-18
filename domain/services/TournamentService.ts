import { v4 as uuidv4 } from "uuid";
import { TournamentRepository } from "../repositories/TournamentRepository";
import { Couple, Match, Tournament } from "@prisma/client";
import { CreateTournamentInput } from "../models/Tournament";

export class TournamentService {
  private tournamentRepository = new TournamentRepository();

  createTournament(name: string, couples: Couple[], numberOfCourts: number) {
    const tournamentId = uuidv4();

    const matches = this.generateAllPossibleMatches(couples).map((match) => ({
      ...match,
      tournamentId,
    }));

    const tournament: CreateTournamentInput = {
      id: tournamentId,
      name,
      numberOfCourts,
      couples,
      matches,
      currentMatchNumber: 1,
      scores: new Map(couples.map((c) => [c.id, 0])),
    };

    return this.tournamentRepository.createTournament(tournament);
  }

  async getTournamentById(tournamentId: string): Promise<Tournament | null> {
    return this.tournamentRepository.getTournamentById(tournamentId);
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return this.tournamentRepository.getAllTournaments();
  }

  async updateTournament(updatedTournament: any): Promise<void> {
    await this.tournamentRepository.updateTournament(updatedTournament);
  }

  generateAllPossibleMatches(couples: Couple[]): Match[] {
    const matches: Match[] = [];
    for (let i = 0; i < couples.length; i++) {
      for (let j = i + 1; j < couples.length; j++) {
        matches.push({
          id: uuidv4(),
          // @ts-ignore
          tournamentId: "", // Will be set when creating the tournament
          // @ts-ignore
          couple1: couples[i],
          couple2: couples[j],
        });
      }
    }
    return matches;
  }

  generateMatches(tournament: CreateTournamentInput): Match[] {
    if (tournament.matches.length === 0) {
      // Generate all possible matches if none exist
      tournament.matches = this.generateAllPossibleMatches(tournament.couples);
    }
    const numberOfCourts = tournament.numberOfCourts;
    const unplayedMatches = tournament.matches.filter(
      (match) =>
        match.couple1Score === undefined && match.couple2Score === undefined,
    );

    // Shuffle unplayedMatches
    const shuffledMatches = this.shuffleArray(unplayedMatches);

    const matchesThisRound: Match[] = [];
    const couplesInThisRound = new Set<string>();

    for (const match of shuffledMatches) {
      if (
        // @ts-ignore
        !couplesInThisRound.has(match.couple1.id) &&
        // @ts-ignore
        !couplesInThisRound.has(match.couple2.id)
      ) {
        matchesThisRound.push(match);
        // @ts-ignore
        couplesInThisRound.add(match.couple1.id);
        // @ts-ignore
        couplesInThisRound.add(match.couple2.id);

        if (matchesThisRound.length >= numberOfCourts) {
          break;
        }
      }
    }

    return matchesThisRound;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  calculateLeader(tournament: CreateTournamentInput): Couple | undefined {
    let maxScore = -1;
    let leader: Couple | undefined = undefined;

    for (const couple of tournament.couples) {
      const score = tournament.scores.get(couple.id) || 0;
      if (score > maxScore) {
        maxScore = score;
        leader = couple;
      }
    }
    return leader;
  }

  updateScores(tournament: any, matchResults: Match[]): any {
    const updatedTournament = {
      ...tournament,
      matches: tournament.matches.map((match: any) => ({ ...match })),
      scores:
        tournament.scores instanceof Map
          ? new Map(tournament.scores)
          : new Map(),
    };

    for (const result of matchResults) {
      const matchIndex = updatedTournament.matches.findIndex(
        (m: any) => m.id === result.id,
      );
      if (matchIndex !== -1) {
        const match = updatedTournament.matches[matchIndex];
        match.couple1Score = result.couple1Score;
        match.couple2Score = result.couple2Score;

        const couple1Score =
          updatedTournament.scores.get(match.couple1.id) || 0;
        const couple2Score =
          updatedTournament.scores.get(match.couple2.id) || 0;

        updatedTournament.scores.set(
          match.couple1.id,
          couple1Score + (result.couple1Score || 0),
        );
        updatedTournament.scores.set(
          match.couple2.id,
          couple2Score + (result.couple2Score || 0),
        );
      }
    }

    updatedTournament.currentMatchNumber += 1;
    updatedTournament.currentLeader = this.calculateLeader(updatedTournament);

    const allMatchesCompleted = updatedTournament.matches.every(
      (match: any) =>
        match.couple1Score !== undefined && match.couple2Score !== undefined,
    );

    if (allMatchesCompleted) {
      updatedTournament.winners = this.calculateWinners(updatedTournament);
    } else {
      updatedTournament.winners = [];
    }

    return updatedTournament;
  }

  calculateWinners(tournament: CreateTournamentInput): Couple[] {
    const highestScore = Math.max(...Array.from(tournament.scores.values()), 0);
    const winners = tournament.couples.filter(
      (couple) => tournament.scores.get(couple.id) === highestScore,
    );
    return winners;
  }
}
