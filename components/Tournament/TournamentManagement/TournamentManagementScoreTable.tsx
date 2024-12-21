"use client";

import React from "react";

import { Tournament } from "@/domain/models/Tournament";
import { calculateTotalScores } from "@/utils/tournamentUtils";

interface TournamentManagementScoreTableProps {
  tournament: Tournament;
}

const TournamentManagementScoreTable: React.FC<
  TournamentManagementScoreTableProps
> = ({ tournament }) => {
  const totalScores = calculateTotalScores(tournament);
  const sortedCouples = tournament.couples.slice().sort((a, b) => {
    const scoreA = totalScores.get(a.id) || 0;
    const scoreB = totalScores.get(b.id) || 0;
    return scoreB - scoreA;
  });

  return (
    <>
      <h2 className="mb-4 text-left font-bold text-primary md:text-xl">
        Puntajes
      </h2>
      <div className="w-full rounded-lg border border-zinc-600 bg-zinc-800 p-4 text-white">
        <ul className="divide-y divide-zinc-600 text-sm">
          {sortedCouples.map((couple, index) => (
            <li
              key={couple.id}
              className="flex items-center justify-between rounded-md py-2 text-white hover:bg-zinc-800"
            >
              <span className="flex font-semibold">
                {index + 1} - {couple.player1.name}{" "}
                <span className="mx-1 text-primary">/</span>{" "}
                {couple.player2.name}
              </span>
              <span className="font-bold text-primary">
                {totalScores.get(couple.id)} pts
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TournamentManagementScoreTable;
