"use client";

import React, { useEffect } from "react";
import Confetti from "react-confetti";

import { Tournament } from "@/domain/models/Tournament";
import { useTournamentUpdates } from "@/hooks/useTournamentUpdates/useTournamentUpdates";
import { formatDateInSpanish } from "@/utils/helpers";
import { getWinner } from "@/utils/tournamentUtils";

import TournamentManagementScoreTable from "../TournamentManagement/TournamentManagementScoreTable";
import RoundManager from "./RoundManager";

interface TournamentDetailsProps {
  initialTournament: Tournament;
  isAdmin?: boolean;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  initialTournament,
  isAdmin = false,
}) => {
  const tournament = useTournamentUpdates(initialTournament);
  const winner = getWinner(tournament);

  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;

    const checkConnection = () => {
      const testConnection = new EventSource(
        `/api/tournaments/${tournament.id}/sse`,
      );

      testConnection.onerror = () => {
        testConnection.close();
      };

      testConnection.onopen = () => {
        testConnection.close();
      };

      // Cleanup after 5 seconds
      errorTimeout = setTimeout(() => {
        testConnection.close();
      }, 5000);
    };

    // Check connection status periodically
    const intervalId = setInterval(checkConnection, 30000);

    // Initial check
    checkConnection();

    return () => {
      clearInterval(intervalId);
      clearTimeout(errorTimeout);
    };
  }, [tournament.id]);

  return (
    <div className="my-8 text-center text-white">
      <div className="mb-4">
        <h2 className="text-3xl font-bold uppercase text-primary">
          {tournament.name}
        </h2>
        <h3 className="text-zinc-400">
          {formatDateInSpanish(tournament.createdAt)}
        </h3>
      </div>
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
      <div className="mt-4 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TournamentManagementScoreTable tournament={tournament} />
        </div>
        <div className="w-full lg:w-3/4">
          <RoundManager tournament={tournament} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;
