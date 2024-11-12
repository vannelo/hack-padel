// components/TournamentComponent.tsx
"use client";

import { Match } from "@/domain/models/Match";
import { Tournament } from "@/domain/models/Tournament";
import TournamentForm from "./TournamentForm/TournamentForm";
import { useState } from "react";
import { tournamentService } from "@/domain";
import TournamentTable from "./TournamentTable/TournamentTable";
import TournamentModal from "./TournamentModal/TournamentModal";

const TournamentComponent: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [numberOfCourts, setNumberOfCourts] = useState<number>(1);
  const [isCreatingTournament, setIsCreatingTournament] =
    useState<boolean>(false);
  const [currentMatches, setCurrentMatches] = useState<Match[]>([]);
  const [matchResults, setMatchResults] = useState<
    Map<string, { couple1Score: number; couple2Score: number }>
  >(new Map());
  const [showScoreInputs, setShowScoreInputs] = useState<boolean>(false);
  const [isTournamentOver, setIsTournamentOver] = useState<boolean>(false); // Add this line

  // Handler to start creating a new tournament
  const startCreateTournament = () => {
    setIsCreatingTournament(true);
  };

  // Handler when the tournament is created
  const handleTournamentCreated = (
    newTournament: Tournament,
    courts: number,
  ) => {
    setTournament(newTournament);
    setNumberOfCourts(courts);
    setIsTournamentOver(false); // Reset the tournament over state

    // Generate initial matches
    const initialMatches = tournamentService.generateMatches(
      newTournament,
      courts,
    );
    setCurrentMatches(initialMatches);

    setIsCreatingTournament(false);
  };

  // Handler to start the round
  const startRound = () => {
    setShowScoreInputs(true);
  };

  // Handler to end the round
  const endRound = () => {
    if (!tournament) return;

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

    // Generate next matches
    const nextMatches = tournamentService.generateMatches(
      updatedTournament,
      numberOfCourts,
    );
    setCurrentMatches(nextMatches);
    setTournament(updatedTournament);

    setMatchResults(new Map());
    setShowScoreInputs(false);

    if (nextMatches.length === 0) {
      // Tournament is over
      setIsTournamentOver(true);

      // Calculate winners
      const winners = tournamentService.calculateWinners(updatedTournament);
      updatedTournament.winners = winners;
      setTournament({ ...updatedTournament }); // Update state with winners
    }
  };

  return (
    <>
      {!tournament && !isCreatingTournament && (
        <button
          className="mt-4 rounded bg-primary px-4 py-2 font-black uppercase text-black"
          onClick={startCreateTournament}
        >
          Crear Torneo
        </button>
      )}
      {isCreatingTournament && (
        <TournamentForm onTournamentCreated={handleTournamentCreated} />
      )}
      {tournament && (
        <TournamentTable
          tournament={tournament}
          currentMatches={currentMatches}
          startRound={startRound}
          isTournamentOver={isTournamentOver} // Pass the new prop
        />
      )}
      <TournamentModal
        currentMatches={currentMatches}
        matchResults={matchResults}
        setMatchResults={setMatchResults}
        endRound={endRound}
        showScoreInputs={showScoreInputs}
      />
    </>
  );
};

export default TournamentComponent;
