"use client";

import React, { useState } from "react";
import { Tournament } from "@/domain/models/Tournament";
import { MatchResults } from "@/domain/models/Match";
import MatchCard from "./MatchCard";

interface RoundManagerProps {
  tournament: Tournament;
  isAdmin: boolean;
}

const RoundManager: React.FC<RoundManagerProps> = ({ tournament, isAdmin }) => {
  const [matchResults, setMatchResults] = useState<MatchResults>({});

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

  return (
    <div className="w-full text-white">
      {tournament.rounds.map((round) => (
        <div key={round.id} className="mb-6">
          <h2 className="mb-4 flex items-center gap-4 font-bold text-primary md:text-xl">
            Ronda {round.roundNumber}
            {round.isActive && (
              <span className="rounded-3xl border border-white px-6 py-1 text-sm text-white">
                Actual
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {round.matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                isAdmin={isAdmin}
                matchResults={matchResults}
                isCurrentRound={round.isActive}
                onScoreChange={handleScoreChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoundManager;
