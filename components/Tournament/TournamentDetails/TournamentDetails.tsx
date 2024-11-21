// @ts-nocheck

"use client";

import React from "react";
import { Tournament } from "@/domain/models/Tournament";
import ScoreTable from "./ScoreTable";
import CurrentRoundMatches from "./CurrentRoundMatches";
import RoundManager from "./RoundManager";

interface TournamentDetailsProps {
  tournament: Tournament;
}

const TournamentDetails: React.FC<TournamentDetailsProps> = ({
  tournament,
}) => {
  const currentRound = tournament.rounds.find((round) => round.isActive);
  const currentLeader = determineCurrentLeader(tournament);

  return (
    <div className="space-y-8">
      <h2 className="text-center text-3xl font-bold uppercase tracking-tighter text-primary">
        {tournament.name}
      </h2>
      {!tournament.isFinished && (
        <h3 className="text-center text-2xl font-bold text-gray-300">
          Ronda:{" "}
          <span className="text-primary">
            {tournament.currentRound} de {tournament.rounds.length}
          </span>
        </h3>
      )}
      <ScoreTable tournament={tournament} />
      {currentRound && !tournament.isFinished && (
        <div className="rounded-lg bg-zinc-900 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">
            Partidos de la Ronda Actual
          </h3>
          <CurrentRoundMatches round={currentRound} />
          <RoundManager tournament={tournament} currentRound={currentRound} />
        </div>
      )}
      {tournament.isFinished && (
        <div className="rounded-lg bg-gray-800 p-6">
          <h3 className="mb-4 text-xl font-bold text-white">
            Torneo Finalizado
          </h3>
          <p className="text-white">
            El torneo ha concluido. ¡Gracias por participar!
          </p>
        </div>
      )}
    </div>
  );
};

function determineCurrentLeader(tournament: Tournament): string {
  // Implement logic to determine the current leader based on match results
  // This is a placeholder implementation
  return "Por determinar";
}

export default TournamentDetails;
