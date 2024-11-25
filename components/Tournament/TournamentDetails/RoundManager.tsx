"use client";

import React, { useState } from "react";
import { Tournament } from "@/domain/models/Tournament";
import { Round } from "@/domain/models/Round";
import { endRound, updateMatchResults } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";
import CoupleName from "@/components/UI/CoupleName/CoupleName";

interface RoundManagerProps {
  tournament: Tournament;
  currentRound: Round;
  isAdmin: boolean;
}

const RoundManager: React.FC<RoundManagerProps> = ({
  tournament,
  currentRound,
  isAdmin,
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
    <div className="mb-4">
      <h2 className="mb-4 text-center text-xl font-bold">
        Ronda {tournament.currentRound} de {tournament.rounds.length}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentRound.matches.map((match) => (
          <div
            key={match.id}
            className="rounded-3xl border border-zinc-600 p-8 text-center"
          >
            <h3 className="mb-4 border border-black border-b-zinc-600 p-2 text-xl font-bold text-primary">
              Cancha {match.court}
            </h3>
            <div className="flex items-center justify-center space-x-4 text-white">
              <div>
                <CoupleName couple={match.couple1} />
                {isAdmin && (
                  <>
                    <p className="mt-4 text-[12px] font-bold text-white">
                      Puntos
                    </p>
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
                        handleScoreChange(
                          match.id,
                          1,
                          parseInt(e.target.value, 10),
                        )
                      }
                      className="rounded bg-zinc-600 p-2 text-center text-primary"
                    />
                  </>
                )}
              </div>
              <div className="font-bold text-primary">
                <span className="text-primary">vs</span>
              </div>
              <div>
                <CoupleName couple={match.couple2} />
                {isAdmin && (
                  <>
                    <p className="mt-4 text-[12px] font-bold text-white">
                      Puntos
                    </p>
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
                        handleScoreChange(
                          match.id,
                          2,
                          parseInt(e.target.value, 10),
                        )
                      }
                      className="rounded bg-zinc-600 p-2 text-center text-primary"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="my-8 flex w-full items-center justify-center">
          <Button
            isLoading={endingRound}
            onClick={handleEndRound}
            disabled={!allScoresFilled()}
          >
            Terminar Ronda
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black">
              <svg
                className="h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default RoundManager;
