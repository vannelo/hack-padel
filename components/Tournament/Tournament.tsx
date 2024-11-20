// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { Match } from "@/domain/models/Match";
import TournamentScores from "./TournamentScores/TournamentScores";
import TournamentModal from "./TournamentModal/TournamentModal";
import { tournamentService } from "@/domain";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Tournament } from "@prisma/client";
import { updateTournament } from "@/app/actions/tournamentActions";

interface TournamentComponentProps {
  fetchedTournament: Tournament;
}

// @ts-ignore
const TournamentComponent: React.FC<TournamentComponentProps> = ({
  fetchedTournament,
}) => {
  const [tournament, setTournament] = useState<Tournament | null>(
    fetchedTournament || null,
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

      const allMatchesCompleted = updatedTournament.matches.every(
        (match) =>
          match.couple1Score !== undefined && match.couple2Score !== undefined,
      );

      const winners = allMatchesCompleted
        ? tournamentService.calculateWinners(updatedTournament)
        : updatedTournament.winners;

      // Flatten the payload
      const flattenedPayload = {
        ...updatedTournament,
        couples: updatedTournament.couples.map((couple: any) => ({
          id: couple.id,
          tournamentId: couple.tournamentId,
          player1Id: couple.player1.id,
          player2Id: couple.player2.id,
        })),
        matches: updatedTournament.matches.map((match: any) => ({
          id: match.id,
          tournamentId: match.tournamentId,
          couple1Id: match.couple1.id,
          couple2Id: match.couple2.id,
          couple1Score: match.couple1Score,
          couple2Score: match.couple2Score,
        })),
        scores: Object.fromEntries(updatedTournament.scores),
        winners: winners.map((winner: any) => ({ id: winner.id })),
      };

      // Call the action to persist changes
      await updateTournament(flattenedPayload);

      // Update local state
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

  console.log("currentMatches", currentMatches);

  return (
    tournament && (
      <>
        <TournamentScores
          tournament={tournament}
          currentMatches={currentMatches}
          startRound={startRound}
          isTournamentOver={isTournamentOver}
        />
        <Dialog
          open={showScoreInputs}
          onClose={() => setShowScoreInputs(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle textAlign="center">Agregar Resultados</DialogTitle>
          <DialogContent>
            <TournamentModal
              currentMatches={currentMatches}
              matchResults={matchResults}
              setMatchResults={setMatchResults}
              endRound={endRound}
              showScoreInputs={showScoreInputs}
              isSettingScores={isSettingScores}
            />
          </DialogContent>
        </Dialog>
      </>
    )
  );
};

export default TournamentComponent;
