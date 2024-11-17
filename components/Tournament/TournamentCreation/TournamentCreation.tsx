"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button/Button";
import TournamentForm from "../TournamentForm/TournamentForm";

const TournamentCreation: React.FC = () => {
  const [isCreatingTournament, setIsCreatingTournament] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const startCreateTournament = () => {
    setIsCreatingTournament(true);
  };

  const handleTournamentCreated = async (tournamentData: {
    name: string;
    couples: { player1Id: string; player2Id: string }[];
    numberOfCourts: number;
  }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tournamentData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/torneos/${data.id}`);
      } else {
        console.error("Error creating tournament:", data.error);
      }
    } catch (error) {
      console.error("Error in handleTournamentCreated:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isCreatingTournament && (
        <Button
          className="mt-4 rounded bg-primary px-4 py-2 font-black uppercase text-black"
          onClick={startCreateTournament}
          isLoading={isSubmitting}
        >
          Crear Torneo
        </Button>
      )}
      {isCreatingTournament && (
        <TournamentForm onTournamentCreated={handleTournamentCreated} />
      )}
    </>
  );
};

export default TournamentCreation;
