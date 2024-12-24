"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import { endRound, updateMatchResults } from "@/app/actions/tournamentActions";
import { MatchResults } from "@/domain/models/Match";
import { Tournament } from "@/domain/models/Tournament";
import { allScoresFilled } from "@/utils/tournamentUtils";

import MatchCard from "./MatchCard";

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

  console.log("allMatchesFinished", allMatchesFinished);

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
      console.log("finishing tournament 1");
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
    </div>
  );
};

export default RoundManager;
