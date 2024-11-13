import { ITournamentService } from "../interfaces/ITournamentService";
import { Tournament } from "../models/Tournament";
import { Couple } from "../models/Couple";
import { Match } from "../models/Match";
import { v4 as uuidv4 } from "uuid";

export class TournamentService implements ITournamentService {
  createTournament(
    name: string,
    couples: Couple[],
    numberOfCourts: number,
  ): Tournament {
    const tournament: Tournament = {
      id: uuidv4(),
      name,
      couples,
      matches: this.generateAllPossibleMatches(couples),
      currentMatchNumber: 1,
      scores: new Map(couples.map((couple) => [couple.id, 0])),
    };
    return tournament;
  }

  generateAllPossibleMatches(couples: Couple[]): Match[] {
    const matches: Match[] = [];
    for (let i = 0; i < couples.length; i++) {
      for (let j = i + 1; j < couples.length; j++) {
        matches.push({
          id: uuidv4(),
          couple1: couples[i],
          couple2: couples[j],
        });
      }
    }
    return matches;
  }

  generateMatches(tournament: Tournament, numberOfCourts: number): Match[] {
    const unplayedMatches = tournament.matches.filter(
      (match) =>
        match.couple1Score === undefined && match.couple2Score === undefined,
    );
    return unplayedMatches.slice(0, numberOfCourts);
  }

  calculateLeader(tournament: Tournament): Couple | undefined {
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

  // In TournamentService.ts

  updateScores(tournament: Tournament, matchResults: Match[]): Tournament {
    // Create a copy of the tournament to avoid mutating the original
    const updatedTournament: Tournament = {
      ...tournament,
      matches: tournament.matches.map((match) => ({ ...match })),
      scores: new Map(tournament.scores),
    };

    for (const result of matchResults) {
      const matchIndex = updatedTournament.matches.findIndex(
        (m) => m.id === result.id,
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
    return updatedTournament;
  }

  calculateWinners(tournament: Tournament): Couple[] {
    let maxScore = -1;
    const winners: Couple[] = [];

    for (const couple of tournament.couples) {
      const totalScore = tournament.scores.get(couple.id) || 0;
      if (totalScore > maxScore) {
        maxScore = totalScore;
        winners.length = 0;
        winners.push(couple);
      } else if (totalScore === maxScore) {
        winners.push(couple);
      }
    }

    return winners;
  }
}
