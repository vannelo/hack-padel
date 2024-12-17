import { Tournament } from "@/domain/models/Tournament";
import { Round } from "@/domain/models/Round";
import { MatchResults } from "@/domain/models/Match";

export const calculateTotalScores = (tournament: Tournament) => {
  const scores = new Map<string, number>();
  tournament.couples.forEach((couple) => {
    scores.set(couple.id, 0);
  });

  tournament.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (
        match.couple1Score !== undefined &&
        match.couple2Score !== undefined
      ) {
        scores.set(
          match.couple1Id,
          (scores.get(match.couple1Id) || 0) + match.couple1Score,
        );
        scores.set(
          match.couple2Id,
          (scores.get(match.couple2Id) || 0) + match.couple2Score,
        );
      }
    });
  });

  return scores;
};

export const getCurrentRound = (tournament: Tournament) => {
  return tournament.rounds.find((round) => round.isActive) ?? null;
};

export const getWinner = (tournament: Tournament) => {
  const scores = calculateTotalScores(tournament);
  if (tournament.winnerId) {
    return tournament.couples.find(
      (couple) => couple.id === tournament.winnerId,
    );
  }

  let highestScore = 0;
  let winner: any = null;

  scores.forEach((score, coupleId) => {
    if (score > highestScore) {
      highestScore = score;
      winner = tournament.couples.find((couple) => couple.id === coupleId);
    }
  });

  return winner;
};

export const findHighestScore = (scores: Map<string, number>) => {
  let highestScore = 0;
  scores.forEach((score) => {
    if (score > highestScore) {
      highestScore = score;
    }
  });
  return highestScore;
};

export const identifyLeaders = (
  tournament: Tournament,
  totalScores: Map<string, number>,
) => {
  const highestScore = findHighestScore(totalScores);
  return tournament.couples
    .filter((couple) => totalScores.get(couple.id) === highestScore)
    .map((couple) => couple.id);
};

export const findMatchBetweenCouples = (
  tournament: Tournament,
  couple1Id: string,
  couple2Id: string,
) => {
  for (const round of tournament.rounds) {
    const match = round.matches.find(
      (m) =>
        (m.couple1Id === couple1Id && m.couple2Id === couple2Id) ||
        (m.couple1Id === couple2Id && m.couple2Id === couple1Id),
    );
    if (match) return match;
  }
  return null;
};

export const allScoresFilled = (round: Round, matchResults: MatchResults) => {
  return round.matches.every((match) => {
    const scores = matchResults[match.id] || {};
    const couple1Score = scores.couple1Score ?? match.couple1Score;
    const couple2Score = scores.couple2Score ?? match.couple2Score;
    return couple1Score !== null && couple2Score !== null;
  });
};

export const validateScore = (score: number): boolean => {
  return score >= 0 && score <= 10;
};
