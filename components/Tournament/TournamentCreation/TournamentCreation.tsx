"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tournament } from "@/domain/models/Tournament";
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

  const handleTournamentCreated = async (
    newTournament: Tournament,
    numberOfCourts: number,
  ) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTournament.name,
          couples: newTournament.couples.map((c) => c.name),
          numberOfCourts: numberOfCourts,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/torneos/${data.id}`);
      } else {
        console.error(data.error);
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
