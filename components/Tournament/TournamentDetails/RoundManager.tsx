"use client";

import React, { useState } from "react";
import { Tournament } from "@/domain/models/Tournament";
import { Round } from "@/domain/models/Round";
import { endRound, updateMatchResults } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";
import { allScoresFilled, validateScore } from "@/utils/tournamentUtils";
import { MatchResults } from "@/domain/models/Match";
import MatchCard from "./MatchCard";

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
  const [matchResults, setMatchResults] = useState<MatchResults>({});
  const [endingRound, setEndingRound] = useState<boolean>(false);

  const handleScoreChange = (
    matchId: string,
    coupleNumber: 1 | 2,
    score: number,
  ) => {
    if (!validateScore(score)) {
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

  const handleEndRound = async () => {
    try {
      setEndingRound(true);
      await updateMatchResults(tournament.id, currentRound.id, matchResults);
      await endRound(tournament.id, currentRound.id);
      window.location.reload();
    } catch (error) {
      console.error("Error ending round:", error);
      alert("Error al finalizar la ronda. Por favor, inténtalo de nuevo.");
    } finally {
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
          <MatchCard
            key={match.id}
            match={match}
            isAdmin={isAdmin}
            matchResults={matchResults}
            onScoreChange={handleScoreChange}
          />
        ))}
      </div>
      {isAdmin && (
        <div className="my-8 flex w-full items-center justify-center">
          <Button
            isLoading={endingRound}
            onClick={handleEndRound}
            disabled={!allScoresFilled(currentRound, matchResults)}
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
