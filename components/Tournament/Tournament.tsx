"use client";

import { useState, useEffect } from "react";
import { Match } from "@/domain/models/Match";
import { Tournament } from "@/domain/models/Tournament";
import { tournamentService } from "@/domain";
import TournamentTable from "./TournamentTable/TournamentTable";
import TournamentModal from "./TournamentModal/TournamentModal";

interface TournamentComponentProps {
  initialTournament?: Tournament;
}

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
  const [isTournamentOver, setIsTournamentOver] = useState<boolean>(false);
  const [isSettingScores, setIsSettingScores] = useState<boolean>(false);

  useEffect(() => {
    if (tournament) {
      const nextMatches = tournamentService.generateMatches(tournament);
      setCurrentMatches(nextMatches);
      if (nextMatches.length === 0) {
        setIsTournamentOver(true);
        const winners = tournamentService.calculateWinners(tournament);
        const updatedTournament = { ...tournament, winners };
        setTournament(updatedTournament);
      }
    }
  }, [tournament]);

  const startRound = () => {
    setShowScoreInputs(true);
  };

  const endRound = async () => {
    if (!tournament) return;
    setIsSettingScores(true);

    // Collect match results
    const results: Match[] = currentMatches.map((match) => {
      const key = `${match.couple1.id}-${match.couple2.id}`;
      const scores = matchResults.get(key);
      return {
        ...match,
        couple1Score: scores?.couple1Score,
        couple2Score: scores?.couple2Score,
      };
    });

    // Update tournament with new scores
    const updatedTournament = tournamentService.updateScores(
      tournament,
      results,
    );

    // Create a new tournament object to ensure immutability
    const newTournament = { ...updatedTournament };

    setTournament(newTournament);

    // Save updates to server
    await fetch(`/api/tournaments/${tournament.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTournament),
    });

    setMatchResults(new Map());
    setShowScoreInputs(false);
    setIsSettingScores(false);
  };

  return (
    tournament && (
      <>
        <TournamentTable
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
