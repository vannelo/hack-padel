"use client";

import React, { useState } from "react";
import { Tournament } from "@/domain/models/Tournament";
import { Round } from "@/domain/models/Round";
import { endRound, updateMatchResults } from "@/app/actions/tournamentActions";

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

  const handleScoreChange = (
    matchId: string,
    coupleNumber: 1 | 2,
    score: number,
  ) => {
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
      console.log("Ending round for tournament:", tournament.id);
      console.log("Current round:", currentRound.id);
      console.log("Match results:", matchResults);

      await updateMatchResults(tournament.id, currentRound.id, matchResults);
      await endRound(tournament.id, currentRound.id);

      console.log("Round ended successfully");
      // Refresh the page or update the state to reflect the changes
      window.location.reload();
    } catch (error) {
      console.error("Error ending round:", error);
      alert("Error al finalizar la ronda. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="mt-6">
      <h4 className="mb-4 text-lg font-bold text-white">
        Gestionar Ronda Actual
      </h4>
      {currentRound.matches.map((match) => (
        <div key={match.id} className="mb-4 rounded-lg bg-gray-700 p-4">
          <p className="mb-2 text-white">
            {match.couple1.player1.name}/{match.couple1.player2.name} vs{" "}
            {match.couple2.player1.name}/{match.couple2.player2.name}
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="Puntuación Pareja 1"
              value={matchResults[match.id]?.couple1Score || ""}
              onChange={(e) =>
                handleScoreChange(match.id, 1, parseInt(e.target.value))
              }
              className="rounded bg-gray-600 p-2 text-white"
            />
            <input
              type="number"
              placeholder="Puntuación Pareja 2"
              value={matchResults[match.id]?.couple2Score || ""}
              onChange={(e) =>
                handleScoreChange(match.id, 2, parseInt(e.target.value))
              }
              className="rounded bg-gray-600 p-2 text-white"
            />
          </div>
        </div>
      ))}
      <button
        onClick={handleEndRound}
        className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Finalizar Ronda
      </button>
    </div>
  );
};

export default RoundManager;
