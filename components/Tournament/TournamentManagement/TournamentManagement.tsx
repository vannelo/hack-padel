"use client";

import React from "react";
import { Tournament } from "@/domain/models/Tournament";
import RoundManager from "../TournamentDetails/RoundManager";
import Confetti from "react-confetti";
import { formatDateInSpanish } from "@/utils/helpers";
import { getWinner } from "@/utils/tournamentUtils";
import TournamentManagementScoreTable from "./TournamentManagementScoreTable";

interface TournamentManagementProps {
  initialTournament: Tournament;
  isAdmin?: boolean;
}

const TournamentManagement: React.FC<TournamentManagementProps> = ({
  initialTournament,
  isAdmin = false,
}) => {
  const currentRound =
    initialTournament.rounds.find((round) => round.isActive) ?? null;
  const winner = getWinner(initialTournament);

  return (
    <div className="my-2 text-center text-white">
      <div className="mb-4">
        <h2 className="text-3xl font-bold uppercase text-primary">
          {initialTournament.name}
        </h2>
        <h3 className="text-zinc-400">
          {formatDateInSpanish(initialTournament.createdAt)}
        </h3>
      </div>
      <div className="mt-4 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <TournamentManagementScoreTable tournament={initialTournament} />
        </div>
        <div className="w-full lg:w-3/4">
          {!initialTournament.isFinished && currentRound && (
            <RoundManager tournament={initialTournament} isAdmin={isAdmin} />
          )}
        </div>
      </div>
      {initialTournament.isFinished && (
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
              {winner?.player1.name} / {winner?.player2.name}
            </span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default TournamentManagement;
