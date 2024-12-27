"use client";

import React, { useState } from "react";

import TableLoader from "@/components/UI/TableLoader/TableLoader";
import { Tournament } from "@/domain/models/Tournament";
import { getWinner } from "@/utils/tournamentUtils";

import RoundManager from "../TournamentDetails/RoundManager";
import TournamentTitle from "../TournamentTitle/TournamentTitle";
import TournamentWinners from "../TournamentWinners/TournamentWinners";
import TournamentManagementScoreTable from "./TournamentManagementScoreTable";

interface TournamentManagementProps {
  initialTournament: Tournament;
  isAdmin?: boolean;
}

const TournamentManagement: React.FC<TournamentManagementProps> = ({
  initialTournament,
  isAdmin = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const winner = getWinner(initialTournament);

  const handleLoadingState = (state: boolean) => {
    setIsLoading(state);
  };

  return (
    <div className="relative my-2 text-center text-white">
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-white">
            <TableLoader />
          </div>
        </div>
      )}
      <TournamentTitle
        tournamentName={initialTournament.name}
        tournamentDate={initialTournament.createdAt}
      />
      {initialTournament.isFinished && <TournamentWinners winner={winner} />}
      <div className="mb-4 mt-4 flex flex-col justify-center gap-8 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TournamentManagementScoreTable tournament={initialTournament} />
        </div>
        <div className="w-full lg:w-3/4">
          <RoundManager
            tournament={initialTournament}
            isAdmin={isAdmin}
            onLoadingStateChange={handleLoadingState}
          />
        </div>
      </div>
    </div>
  );
};

export default TournamentManagement;
