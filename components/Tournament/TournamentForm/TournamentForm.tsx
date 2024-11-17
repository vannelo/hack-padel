"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Player } from "@/domain/models/Player";
import Button from "@/components/UI/Button/Button";

interface TournamentFormProps {
  onTournamentCreated: (tournamentData: {
    name: string;
    couples: { player1Id: string; player2Id: string }[];
    numberOfCourts: number;
  }) => void;
}

const fetchPlayers = async (): Promise<Player[]> => {
  const response = await fetch("/api/players");
  if (!response.ok) {
    throw new Error("Failed to fetch players");
  }
  return response.json();
};

const TournamentForm: React.FC<TournamentFormProps> = ({
  onTournamentCreated,
}) => {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [numberOfCourts, setNumberOfCourts] = useState<number>(1);
  const [couples, setCouples] = useState<
    { player1Id: string; player2Id: string }[]
  >([{ player1Id: "", player2Id: "" }]);
  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ["players"],
    queryFn: fetchPlayers,
  });

  const addCouple = () => {
    setCouples((prev) => [...prev, { player1Id: "", player2Id: "" }]);
  };

  const createTournament = async (e: React.FormEvent) => {
    e.preventDefault();

    const validCouples = couples.filter(
      (c) => c.player1Id && c.player2Id && c.player1Id !== c.player2Id,
    );

    if (validCouples.length < 3) {
      setValidationError(
        "Al menos se necesitan 3 parejas completas para comenzar el torneo",
      );
      return;
    }

    setValidationError("");
    setIsSubmitting(true);

    try {
      await onTournamentCreated({
        name: tournamentName,
        couples: validCouples,
        numberOfCourts,
      });
    } catch (error) {
      console.error("Error in createTournament:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (playersLoading) {
    return <div>Cargando jugadores...</div>;
  }

  return (
    <form
      onSubmit={createTournament}
      className="mt-4 min-w-[550px] max-w-lg rounded bg-white p-4 text-center text-black shadow-lg"
    >
      <h3 className="text-center text-xl font-bold">CREAR TORNEO</h3>
      <p className="mb-8 text-sm">Ingresa los datos del torneo</p>
      <label
        htmlFor="tournamentName"
        className="mb-2 block text-left text-center text-sm font-bold uppercase"
      >
        Nombre del torneo
      </label>
      <input
        type="text"
        id="tournamentName"
        placeholder="Ej. Retas 3ra, 4ta, padel beer, etc."
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
        className="mb-4 w-full border p-2 text-center text-sm"
        required
        disabled={isSubmitting}
      />
      <label
        htmlFor="numberOfCourts"
        className="mb-2 block text-left text-center text-sm font-bold uppercase"
      >
        Canchas Disponibles
      </label>
      <div className="mb-4 flex justify-center space-x-4">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            type="button"
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold ${
              numberOfCourts === num
                ? "border-primary bg-primary"
                : "border-gray-300 bg-white text-black"
            } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={() => setNumberOfCourts(num)}
            disabled={isSubmitting}
          >
            {num}
          </button>
        ))}
      </div>
      {couples.map((couple, index) => (
        <div key={index} className="mb-4">
          <h4 className="mb-2 text-left text-sm font-bold uppercase">
            Pareja {index + 1}
          </h4>
          <div className="flex space-x-2">
            <select
              name="player1"
              value={couple.player1Id}
              onChange={(e) => {
                const newCouples = [...couples];
                newCouples[index].player1Id = e.target.value;
                setCouples(newCouples);
              }}
              className="w-1/2 border p-2 text-sm"
              required
              disabled={isSubmitting}
            >
              <option value="">Selecciona Jugador 1</option>
              {players?.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <select
              name="player2"
              value={couple.player2Id}
              onChange={(e) => {
                const newCouples = [...couples];
                newCouples[index].player2Id = e.target.value;
                setCouples(newCouples);
              }}
              className="w-1/2 border p-2 text-sm"
              required
              disabled={isSubmitting}
            >
              <option value="">Selecciona Jugador 2</option>
              {players?.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <div className="flex">
        <button
          type="button"
          className="mt-2 rounded bg-secondary px-4 py-2 text-sm font-bold text-white"
          onClick={addCouple}
          disabled={isSubmitting}
        >
          Agregar pareja
        </button>
      </div>
      {validationError && (
        <p className="mt-2 text-sm font-bold text-red-500">{validationError}</p>
      )}
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
      >
        Comenzar torneo
      </Button>
    </form>
  );
};

export default TournamentForm;
