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
      matches: [],
      currentMatchNumber: 1,
      scores: new Map<string, number>(),
    };

    tournament.matches = this.generateAllPossibleMatches(couples);

    // Initialize scores
    couples.forEach((couple) => {
      tournament.scores.set(couple.id, 0);
    });

    return tournament;
  }

  generateAllPossibleMatches(couples: Couple[]): Match[] {
    const matches: Match[] = [];
    for (let i = 0; i < couples.length; i++) {
      for (let j = i + 1; j < couples.length; j++) {
        matches.push({
          couple1: couples[i],
          couple2: couples[j],
        });
      }
    }
    return matches;
  }

  generateMatches(tournament: Tournament, numberOfCourts: number): Match[] {
    const { matches } = tournament;
    const scheduledMatches: Match[] = [];

    const unscheduledMatches = matches.filter(
      (match) =>
        match.couple1Score === undefined && match.couple2Score === undefined,
    );

    const playingCouples = new Set<string>();

    for (const match of unscheduledMatches) {
      if (
        !playingCouples.has(match.couple1.id) &&
        !playingCouples.has(match.couple2.id)
      ) {
        scheduledMatches.push(match);
        playingCouples.add(match.couple1.id);
        playingCouples.add(match.couple2.id);

        if (scheduledMatches.length >= numberOfCourts) break;
      }
    }

    return scheduledMatches;
  }

  calculateLeader(tournament: Tournament): Couple | undefined {
    let maxScore = -1;
    let leader: Couple | undefined;

    for (const couple of tournament.couples) {
      const totalScore = tournament.scores.get(couple.id) || 0;
      if (totalScore > maxScore) {
        maxScore = totalScore;
        leader = couple;
      }
    }

    return leader;
  }

  updateScores(tournament: Tournament, matchResults: Match[]): Tournament {
    for (const result of matchResults) {
      // Update match scores
      const match = tournament.matches.find(
        (m) =>
          (m.couple1.id === result.couple1.id &&
            m.couple2.id === result.couple2.id) ||
          (m.couple1.id === result.couple2.id &&
            m.couple2.id === result.couple1.id),
      );

      if (match) {
        match.couple1Score = result.couple1Score;
        match.couple2Score = result.couple2Score;

        // Update total scores
        const couple1TotalScore =
          (tournament.scores.get(match.couple1.id) || 0) +
          (result.couple1Score || 0);
        const couple2TotalScore =
          (tournament.scores.get(match.couple2.id) || 0) +
          (result.couple2Score || 0);

        tournament.scores.set(match.couple1.id, couple1TotalScore);
        tournament.scores.set(match.couple2.id, couple2TotalScore);
      }
    }

    tournament.currentMatchNumber += 1;
    tournament.currentLeader = this.calculateLeader(tournament);

    return tournament;
  }

  calculateWinners(tournament: Tournament): Couple[] {
    let maxScore = -1;
    const winners: Couple[] = [];

    for (const couple of tournament.couples) {
      const totalScore = tournament.scores.get(couple.id) || 0;
      if (totalScore > maxScore) {
        maxScore = totalScore;
        winners.length = 0; // Clear the winners array
        winners.push(couple);
      } else if (totalScore === maxScore) {
        winners.push(couple);
      }
    }

    return winners;
  }
}
