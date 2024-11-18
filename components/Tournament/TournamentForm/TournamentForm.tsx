"use client";

import React, { useState, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { getAllPlayers } from "@/app/actions/playerActions";
import { createTournament } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

interface TournamentFormProps {
  onTournamentCreated: () => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  onTournamentCreated,
}) => {
  const [tournamentData, setTournamentData] = useState({
    name: "",
    numberOfCourts: 1,
    couples: [{ id: uuidv4(), tournamentId: "", player1Id: "", player2Id: "" }],
  });
  const [validationError, setValidationError] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ["players"],
    queryFn: getAllPlayers,
  });

  const addCouple = () => {
    setTournamentData((prevData) => ({
      ...prevData,
      couples: [
        ...prevData.couples,
        { id: uuidv4(), tournamentId: "", player1Id: "", player2Id: "" },
      ],
    }));
  };

  const handleCoupleChange = (
    index: number,
    key: "player1Id" | "player2Id",
    value: string,
  ) => {
    setTournamentData((prevData) => {
      const updatedCouples = [...prevData.couples];
      updatedCouples[index][key] = value;
      return { ...prevData, couples: updatedCouples };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validCouples = tournamentData.couples.filter(
      (c) => c.player1Id && c.player2Id && c.player1Id !== c.player2Id,
    );

    if (validCouples.length < 3) {
      setValidationError(
        "Al menos se necesitan 3 parejas completas para comenzar el torneo",
      );
      return;
    }

    setValidationError("");
    startTransition(async () => {
      try {
        await createTournament({
          ...tournamentData,
          couples: validCouples,
        });
        onTournamentCreated();
      } catch (error) {
        console.error("Error submitting tournament data:", error);
      }
    });
  };

  if (playersLoading) {
    return <TableLoader />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 min-w-[550px] max-w-lg text-center text-black"
    >
      <label
        htmlFor="tournamentName"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Nombre del torneo
      </label>
      <input
        id="name"
        type="text"
        value={tournamentData.name}
        onChange={(e) =>
          setTournamentData((prevData) => ({
            ...prevData,
            name: e.target.value,
          }))
        }
        required
        className="mb-4 w-full border p-2"
      />
      <label
        htmlFor="numberOfCourts"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Canchas Disponibles
      </label>
      <div className="mb-2 flex space-x-2">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() =>
              setTournamentData((prevData) => ({
                ...prevData,
                numberOfCourts: num,
              }))
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold ${
              tournamentData.numberOfCourts === num
                ? "border-primary bg-primary"
                : "border-gray-300 bg-white text-black"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
      {tournamentData.couples.map((couple, index) => (
        <div key={index} className="mb-4">
          <h4 className="mb-2 text-left text-sm font-bold uppercase">
            Pareja {index + 1}
          </h4>
          <div className="flex space-x-2">
            <select
              value={couple.player1Id}
              onChange={(e) =>
                handleCoupleChange(index, "player1Id", e.target.value)
              }
              className="w-1/2 border p-2 text-sm"
              required
            >
              <option value="">Jugador 1</option>
              {players?.map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
            <select
              value={couple.player2Id}
              onChange={(e) =>
                handleCoupleChange(index, "player2Id", e.target.value)
              }
              className="w-1/2 border p-2 text-sm"
              required
            >
              <option value="">Jugador 2</option>
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
          onClick={addCouple}
          className="mt-2 rounded bg-secondary px-4 py-2 text-sm font-bold text-white"
        >
          Agregar pareja
        </button>
      </div>

      {validationError && (
        <p className="mt-2 text-sm font-bold text-red-500">{validationError}</p>
      )}
      <Button
        type="submit"
        isLoading={isPending}
        className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
      >
        Comenzar Torneo
      </Button>
    </form>
  );
};

export default TournamentForm;
