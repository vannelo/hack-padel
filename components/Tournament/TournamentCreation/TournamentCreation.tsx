"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tournament } from "@/domain/models/Tournament";
import TournamentForm from "../TournamentForm/TournamentForm";
import Button from "@/components/UI/Button/Button";

const TournamentCreation: React.FC = () => {
  const [isCreatingTournament, setIsCreatingTournament] =
    useState<boolean>(false);

  const router = useRouter();

  const startCreateTournament = () => {
    setIsCreatingTournament(true);
  };

  const handleTournamentCreated = async (
    newTournament: Tournament,
    courts: number,
  ) => {
    try {
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTournament.name,
          couples: newTournament.couples.map((c) => c.name),
          numberOfCourts: courts,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/torneos/${data.id}`);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      {!isCreatingTournament && (
        <Button
          className="mt-4 rounded bg-primary px-4 py-2 font-black uppercase text-black"
          onClick={startCreateTournament}
        >
          Crear torneo
        </Button>
      )}
      {isCreatingTournament && (
        <TournamentForm onTournamentCreated={handleTournamentCreated} />
      )}
    </>
  );
};

export default TournamentCreation;
