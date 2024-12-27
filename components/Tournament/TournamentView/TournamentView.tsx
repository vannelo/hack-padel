"use client";

import React, { useEffect } from "react";

import { Tournament } from "@/domain/models/Tournament";
import { useTournamentUpdates } from "@/hooks/useTournamentUpdates/useTournamentUpdates";
import { createTournamentSSEUrl } from "@/utils/helpers";
import { getWinner } from "@/utils/tournamentUtils";

import RoundManager from "../TournamentDetails/RoundManager";
import TournamentManagementScoreTable from "../TournamentManagement/TournamentManagementScoreTable";
import TournamentTitle from "../TournamentTitle/TournamentTitle";
import TournamentWinners from "../TournamentWinners/TournamentWinners";

interface TournamentViewProps {
  initialTournament: Tournament;
  isAdmin?: boolean;
}

const TournamentView: React.FC<TournamentViewProps> = ({
  initialTournament,
  isAdmin = false,
}) => {
  const tournament = useTournamentUpdates(initialTournament);
  const winner = getWinner(tournament);

  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;

    const checkConnection = () => {
      const testConnection = new EventSource(
        createTournamentSSEUrl(tournament.id),
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
      <TournamentTitle
        tournamentName={tournament.name}
        tournamentDate={tournament.createdAt}
      />
      {tournament.isFinished && <TournamentWinners winner={winner} />}
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

export default TournamentView;
