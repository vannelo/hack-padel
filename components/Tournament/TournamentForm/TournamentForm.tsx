"use client";

import React, { useState, useTransition, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { createTournament } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";
import { Player } from "@/domain/models/Player";
import { Couple } from "@/domain/models/Couple";
import { getAllPlayers } from "@/app/actions/playerActions";

interface TournamentFormProps {
  onTournamentCreated: () => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  onTournamentCreated,
}) => {
  const [tournamentData, setTournamentData] = useState({
    name: "",
    courts: 1,
  });
  const [couples, setCouples] = useState<Couple[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getAllPlayers();
      setPlayers(fetchedPlayers);
    };
    fetchPlayers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTournamentData((prevData) => ({
      ...prevData,
      [name]: name === "courts" ? parseInt(value) : value,
    }));
  };

  const handleAddCouple = (player1Id: string, player2Id: string) => {
    const player1 = players.find((p) => p.id === player1Id);
    const player2 = players.find((p) => p.id === player2Id);
    if (player1 && player2) {
      const newCouple: Couple = {
        id: uuidv4(),
        player1Id: player1.id,
        player1: player1,
        player2Id: player2.id,
        player2: player2,
        tournamentId: "", // This will be set when the tournament is created
      };
      setCouples([...couples, newCouple]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couples.length < 4) {
      alert("Se necesitan al menos 4 parejas para crear un torneo.");
      return;
    }

    startTransition(async () => {
      try {
        await createTournament(
          tournamentData.name,
          tournamentData.courts,
          couples,
        );
        setTournamentData({
          name: "",
          courts: 1,
        });
        setCouples([]);
        onTournamentCreated();
      } catch (error) {
        console.error("Error submitting tournament data:", error);
        alert(
          "Error al crear el torneo: " +
            (error instanceof Error ? error.message : String(error)),
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="name"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Nombre del Torneo
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={tournamentData.name}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2 text-black"
        required
      />
      <label
        htmlFor="courts"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Número de Canchas
      </label>
      <div className="mb-2 flex space-x-2">
        {[1, 2, 3].map((court) => (
          <button
            key={court}
            type="button"
            onClick={() =>
              setTournamentData((prevData) => ({
                ...prevData,
                courts: court,
              }))
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold ${
              tournamentData.courts === court
                ? "border-primary bg-primary"
                : "border-gray-300 bg-white text-black"
            }`}
          >
            {court}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="mb-2 text-left text-sm font-bold uppercase">Parejas</h3>
        {couples.map((couple, index) => (
          <div key={couple.id} className="mb-2">
            Pareja {index + 1}: {couple.player1.name} & {couple.player2.name}
          </div>
        ))}
        <div className="flex gap-2">
          <select className="flex-1 border p-2 text-black">
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <select className="flex-1 border p-2 text-black">
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={() => {
              const selects = document.querySelectorAll("select");
              handleAddCouple(selects[0].value, selects[1].value);
            }}
            className="bg-secondary px-4 py-2 text-white"
          >
            Agregar Pareja
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        isLoading={isPending}
        className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
      >
        Crear Torneo
      </Button>
    </form>
  );
};

export default TournamentForm;
