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
      <div className="rounded-lg bg-gray-800 p-6">
        <h2 className="mb-4 text-2xl font-bold text-white">
          {tournament.name}
        </h2>
        <p className="text-gray-300">Canchas: {tournament.courts}</p>
        <p className="text-gray-300">Parejas: {tournament.couples.length}</p>
        <p className="text-gray-300">Líder actual: {currentLeader}</p>
        <p className="text-gray-300">
          Estado: {tournament.isFinished ? "Finalizado" : "En progreso"}
        </p>
        {!tournament.isFinished && (
          <p className="text-gray-300">
            Ronda actual: {tournament.currentRound} de{" "}
            {tournament.rounds.length}
          </p>
        )}
      </div>

      <div className="rounded-lg bg-gray-800 p-6">
        <h3 className="mb-4 text-xl font-bold text-white">
          Tabla de Puntuaciones
        </h3>
        <ScoreTable tournament={tournament} />
      </div>

      {currentRound && !tournament.isFinished && (
        <div className="rounded-lg bg-gray-800 p-6">
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
