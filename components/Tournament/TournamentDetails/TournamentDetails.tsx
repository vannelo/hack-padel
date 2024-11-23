"use client";

import React from "react";
import { Tournament } from "@/domain/models/Tournament";
import ScoreTable from "./ScoreTable";
import RoundManager from "./RoundManager";
import Confetti from "react-confetti";
import { formatDateInSpanish } from "@/utils/helpers";

interface TournamentDetailsProps {
  tournament: Tournament;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  tournament,
}) => {
  const currentRound = tournament.rounds.find((round) => round.isActive);

  // Helper to calculate the total scores for each couple
  const calculateTotalScores = () => {
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

  // Determine the winner
  const getWinner = () => {
    const scores = calculateTotalScores();
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

  const winner = getWinner();

  return (
    <div className="text-center text-white">
      <div className="mb-4">
        <h2 className="text-3xl font-bold uppercase text-primary">
          {tournament.name}
        </h2>
        <h3 className="text-zinc-400">
          {formatDateInSpanish(tournament.createdAt)}
        </h3>
      </div>
      <ScoreTable tournament={tournament} />
      {currentRound && !tournament.isFinished && (
        <RoundManager tournament={tournament} currentRound={currentRound} />
      )}
      {tournament.isFinished && (
        <div className="relative rounded-lg bg-zinc-900 p-6 text-center">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
          />
          <h2 className="text-2xl font-bold text-white">Torneo Finalizado</h2>
          <p className="text-white">¡Felicidades a los ganadores!</p>
          <h3 className="text-4xl font-bold text-white">
            <span className="text-primary">
              {winner.player1.name} / {winner.player2.name}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;
