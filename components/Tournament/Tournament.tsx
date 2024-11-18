// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Match } from "@/domain/models/Match";
import { Tournament } from "@/domain/models/Tournament";
import TournamentScores from "./TournamentScores/TournamentScores";
import TournamentModal from "./TournamentModal/TournamentModal";
import { tournamentService } from "@/domain";

interface TournamentComponentProps {
  initialTournament?: Tournament;
}

// @ts-ignore
const TournamentComponent: React.FC<TournamentComponentProps> = ({
  initialTournament,
}) => {
  const [tournament, setTournament] = useState<Tournament | null>(
    initialTournament || null,
  );
  const [currentMatches, setCurrentMatches] = useState<Match[]>([]);
  const [matchResults, setMatchResults] = useState<
    Map<string, { couple1Score: number; couple2Score: number }>
  >(new Map());
  const [showScoreInputs, setShowScoreInputs] = useState<boolean>(false);
  const [isSettingScores, setIsSettingScores] = useState<boolean>(false);
  const [isTournamentOver, setIsTournamentOver] = useState<boolean>(false);

  useEffect(() => {
    if (!tournament) return;

    // Generate next matches
    const nextMatches = tournamentService.generateMatches(tournament);

    setCurrentMatches(nextMatches);

    // Calculate current leader
    const currentLeader = tournamentService.calculateLeader(tournament);
    if (
      !tournament.currentLeader ||
      tournament.currentLeader.id !== currentLeader?.id
    ) {
      setTournament((prev) => ({
        ...prev!,
        currentLeader,
      }));
    }

    // Determine if the tournament is over
    const allMatchesCompleted = tournament.matches.every(
      (match) =>
        match.couple1Score !== undefined && match.couple2Score !== undefined,
    );
    setIsTournamentOver(allMatchesCompleted);

    // Handle winners if tournament is over
    if (allMatchesCompleted && !tournament.winners?.length) {
      const winners = tournamentService.calculateWinners(tournament);
      setTournament((prev) => ({
        ...prev!,
        winners,
      }));
    }
  }, [tournament]);

  const startRound = () => {
    setShowScoreInputs(true);
  };

  const endRound = async () => {
    if (!tournament) return;
    setIsSettingScores(true);

    try {
      const results = currentMatches.map((match) => {
        const key = `${match.couple1.id}-${match.couple2.id}`;
        const scores = matchResults.get(key);
        return {
          ...match,
          couple1Score: scores?.couple1Score ?? null,
          couple2Score: scores?.couple2Score ?? null,
        };
      });

      // Update the tournament object locally with new scores
      const updatedTournament = tournamentService.updateScores(
        tournament,
        results,
      );

      // Determine if all matches are complete
      const allMatchesCompleted = updatedTournament.matches.every(
        (match) =>
          match.couple1Score !== undefined && match.couple2Score !== undefined,
      );

      const winners = allMatchesCompleted
        ? tournamentService.calculateWinners(updatedTournament)
        : updatedTournament.winners;

      // Prepare payload for the backend
      const payload = {
        ...updatedTournament,
        scores: Object.fromEntries(updatedTournament.scores),
        winners: winners.map((winner) => ({ id: winner.id })),
      };

      // Persist updated data to the backend
      await fetch(`/api/tournaments/${tournament.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Update local state with updated tournament data
      setTournament({
        ...updatedTournament,
        winners,
      });
    } catch (error) {
      console.error("Error during endRound:", error);
    } finally {
      setMatchResults(new Map());
      setShowScoreInputs(false);
      setIsSettingScores(false);
    }
  };

  return (
    tournament && (
      <>
        <TournamentScores
          tournament={tournament}
          currentMatches={currentMatches}
          startRound={startRound}
          isTournamentOver={isTournamentOver}
        />
        <TournamentModal
          currentMatches={currentMatches}
          matchResults={matchResults}
          setMatchResults={setMatchResults}
          endRound={endRound}
          showScoreInputs={showScoreInputs}
          isSettingScores={isSettingScores}
        />
      </>
    )
  );
};

export default TournamentComponent;
