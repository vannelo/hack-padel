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
  onLoadingStateChange?: (state: boolean) => void;
}

const RoundManager: React.FC<RoundManagerProps> = ({
  tournament,
  isAdmin,
  onLoadingStateChange = () => {},
}) => {
  const [matchResults, setMatchResults] = useState<MatchResults>({});
  const [processingNextRound, setProcessingNextRound] = useState(false);
  const [triggerNextRound, setTriggerNextRound] = useState(false);
  const [allMatchesFinished, setAllMatchesFinished] = useState(false);
  const router = useRouter();

  const currentRound = tournament.rounds.find((round) => round.isActive);

  const proceedToNextRound = useCallback(async () => {
    if (!currentRound) return;

    try {
      onLoadingStateChange(true);
      setProcessingNextRound(true);

      // Update match results for the current round
      await updateMatchResults(tournament.id, currentRound.id, matchResults);

      // End the current round
      await endRound(tournament.id, currentRound.id);

      // After ending the round, we refresh data to see if there's a next round
      // or if we've finished all rounds.
      router.refresh();
    } catch (error) {
      console.error("Error proceeding to next round:", error);
      alert("Error proceeding to the next round. Please try again.");
    } finally {
      setProcessingNextRound(false);
      setTriggerNextRound(false);
      setMatchResults({});
      onLoadingStateChange(false);
    }
  }, [tournament.id, currentRound, matchResults, onLoadingStateChange, router]);

  // Check if we need to trigger the next round as soon as scores are filled for the current round
  useEffect(() => {
    if (
      !processingNextRound &&
      currentRound &&
      allScoresFilled(currentRound, matchResults)
    ) {
      setTriggerNextRound(true);
    }
  }, [matchResults, currentRound, processingNextRound]);

  useEffect(() => {
    if (triggerNextRound && currentRound) {
      proceedToNextRound();
    }
  }, [triggerNextRound, currentRound, proceedToNextRound]);

  // Determine if all matches in all rounds are finished (no active round and scores are set)
  useEffect(() => {
    const noActiveRounds = !tournament.rounds.some((round) => round.isActive);
    const everyRoundComplete = tournament.rounds.every((round) =>
      round.matches.every(
        (m) =>
          m.couple1Score !== null &&
          m.couple2Score !== null &&
          m.couple1Score !== undefined &&
          m.couple2Score !== undefined,
      ),
    );

    // If there's no active round and all rounds' matches have scores,
    // then allMatchesFinished = true.
    if (noActiveRounds && everyRoundComplete && !tournament.isFinished) {
      setAllMatchesFinished(true);
    } else {
      setAllMatchesFinished(false);
    }
  }, [tournament]);

  const handleSaveScore = async (
    matchId: string,
    coupleNumber: 1 | 2,
    score: number,
  ) => {
    // We only update scores in memory here; the actual round update happens
    // once we detect all matches are filled and proceedToNextRound is triggered.
    setMatchResults((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [`couple${coupleNumber}Score`]: score,
      },
    }));
  };

  const handleEndTournament = async () => {
    if (!tournament.isFinished && allMatchesFinished) {
      try {
        onLoadingStateChange(true);
        await markTournamentFinished(tournament.id);
        router.refresh();
      } catch (error) {
        console.error("Error ending tournament:", error);
        alert("Error ending the tournament. Please try again.");
      } finally {
        onLoadingStateChange(false);
      }
    }
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
                isAdmin={isAdmin && round.isActive}
                isCurrentRound={round.isActive}
                matchResults={matchResults}
                onScoreChange={handleSaveScore}
                onLoadingStateChange={onLoadingStateChange}
              />
            ))}
          </div>
        </div>
      ))}
      {isAdmin && allMatchesFinished && !tournament.isFinished && (
        <div className="mt-6 flex justify-center">
          <button
            className="rounded-3xl border border-zinc-600 bg-primary px-6 py-2 text-sm font-bold text-black"
            onClick={handleEndTournament}
          >
            Finalizar Torneo
          </button>
        </div>
      )}
    </div>
  );
};

export default RoundManager;
