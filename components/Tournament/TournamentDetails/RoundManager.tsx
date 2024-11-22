"use client";

import React, { useState } from "react";
import { Tournament } from "@/domain/models/Tournament";
import { Round } from "@/domain/models/Round";
import { endRound, updateMatchResults } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";

interface RoundManagerProps {
  tournament: Tournament;
  currentRound: Round;
}

const RoundManager: React.FC<RoundManagerProps> = ({
  tournament,
  currentRound,
}) => {
  const [matchResults, setMatchResults] = useState<{
    [key: string]: { couple1Score: number; couple2Score: number };
  }>({});
  const [endingRound, setEndingRound] = useState<boolean>(false);

  const handleScoreChange = (
    matchId: string,
    coupleNumber: 1 | 2,
    score: number,
  ) => {
    if (score > 10 || score < 0) {
      alert("La puntuación debe estar entre 0 y 10.");
      return;
    }

    setMatchResults((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [`couple${coupleNumber}Score`]: score,
      },
    }));
  };

  // Check if all matches have scores for both couples
  const allScoresFilled = () => {
    return currentRound.matches.every((match) => {
      const results = matchResults[match.id];
      return (
        results?.couple1Score !== undefined &&
        results?.couple2Score !== undefined
      );
    });
  };

  const handleEndRound = async () => {
    try {
      setEndingRound(true);

      await updateMatchResults(tournament.id, currentRound.id, matchResults);
      await endRound(tournament.id, currentRound.id);

      window.location.reload();
      setEndingRound(false);
    } catch (error) {
      console.error("Error ending round:", error);
      alert("Error al finalizar la ronda. Por favor, inténtalo de nuevo.");
      setEndingRound(false);
    }
  };

  return (
    <div className="!mb-32">
      <h2 className="mb-4 text-center text-2xl font-bold text-white">
        Partidos
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentRound.matches.map((match) => (
          <div
            key={match.id}
            className="rounded-lg bg-zinc-900 p-8 text-center"
          >
            <p className="mb-2 text-lg font-bold text-white">
              Cancha {match.court}
            </p>
            <p className="text-gray-300">
              {match.couple1.player1.name}/{match.couple1.player2.name}{" "}
              <span className="text-primary">vs </span>
              {match.couple2.player1.name}/{match.couple2.player2.name}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div>
                <p className="text-[12px] font-bold text-white">Puntos</p>
                <input
                  type="number"
                  min="0"
                  max={10}
                  placeholder="0"
                  value={
                    matchResults[match.id]?.couple1Score !== undefined
                      ? matchResults[match.id]?.couple1Score
                      : ""
                  }
                  onChange={(e) =>
                    handleScoreChange(match.id, 1, parseInt(e.target.value, 10))
                  }
                  className="rounded bg-zinc-600 p-2 text-center text-primary"
                />
              </div>
              <div className="font-bold text-primary">-</div>
              <div>
                <p className="text-[12px] font-bold text-white">Puntos</p>
                <input
                  type="number"
                  min="0"
                  max={10}
                  placeholder="0"
                  value={
                    matchResults[match.id]?.couple2Score !== undefined
                      ? matchResults[match.id]?.couple2Score
                      : ""
                  }
                  onChange={(e) =>
                    handleScoreChange(match.id, 2, parseInt(e.target.value, 10))
                  }
                  className="rounded bg-zinc-600 p-2 text-center text-primary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-4 flex max-w-[400px] items-end justify-end">
        <Button
          type="submit"
          isLoading={endingRound}
          onClick={handleEndRound}
          disabled={!allScoresFilled()}
          className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
        >
          Terminar Ronda
        </Button>
      </div>
    </div>
  );
};

export default RoundManager;
