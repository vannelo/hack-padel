"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tournament } from "@/domain/models/Tournament";
import {
  updateMatchResults,
  endRound,
  markTournamentFinished,
} from "@/app/actions/tournamentActions";
import { MatchResults } from "@/domain/models/Match";
import MatchCard from "./MatchCard";
import { allScoresFilled } from "@/utils/tournamentUtils";
import { useRouter } from "next/navigation";

interface RoundManagerProps {
  tournament: Tournament;
  isAdmin: boolean;
  onTournamentUpdate: (tournament: Tournament) => void;
}

const RoundManager: React.FC<RoundManagerProps> = ({
  tournament,
  isAdmin,
  onTournamentUpdate,
}) => {
  const [matchResults, setMatchResults] = useState<MatchResults>({});
  const [processingNextRound, setProcessingNextRound] = useState(false);
  const router = useRouter();

  const handleScoreChange = useCallback(
    (matchId: string, coupleNumber: 1 | 2, score: number) => {
      setMatchResults((prev) => ({
        ...prev,
        [matchId]: {
          ...prev[matchId],
          [`couple${coupleNumber}Score`]: score,
        },
      }));
    },
    [],
  );

  const proceedToNextRound = useCallback(async () => {
    const currentRound = tournament.rounds.find((round) => round.isActive);

    if (currentRound && allScoresFilled(currentRound, matchResults)) {
      try {
        setProcessingNextRound(true);

        // Update match results and end the current round
        await updateMatchResults(tournament.id, currentRound.id, matchResults);
        await endRound(tournament.id, currentRound.id);

        // Check if the tournament is finished
        const nextRoundIndex =
          tournament.rounds.findIndex((round) => round.id === currentRound.id) +
          1;

        const updatedRounds = [...tournament.rounds];
        updatedRounds[nextRoundIndex - 1].isActive = false; // Mark current round inactive

        if (nextRoundIndex < tournament.rounds.length) {
          updatedRounds[nextRoundIndex].isActive = true; // Activate next round
        } else {
          await markTournamentFinished(tournament.id); // Mark tournament as finished
        }

        // Refresh the page data
        router.refresh();
      } catch (error) {
        console.error("Error proceeding to next round:", error);
        alert("Error moving to the next round. Please try again.");
      } finally {
        setProcessingNextRound(false);
      }
    }
  }, [tournament, matchResults, router]);

  useEffect(() => {
    const currentRound = tournament.rounds.find((round) => round.isActive);

    if (currentRound && allScoresFilled(currentRound, matchResults)) {
      proceedToNextRound();
    }
  }, [matchResults, tournament.rounds, proceedToNextRound]);

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
                isCurrentRound={round.isActive}
                matchResults={matchResults}
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
