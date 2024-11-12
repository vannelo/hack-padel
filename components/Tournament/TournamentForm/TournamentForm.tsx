"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Couple } from "@/domain/models/Couple";
import { tournamentService } from "@/domain";
import { Tournament } from "@/domain/models/Tournament";

interface TournamentFormProps {
  onTournamentCreated: (tournament: Tournament, numberOfCourts: number) => void;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  onTournamentCreated,
}) => {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [numberOfCourts, setNumberOfCourts] = useState<number>(1);
  const [coupleInputs, setCoupleInputs] = useState<string[]>(["", "", "", ""]);
  const [validationError, setValidationError] = useState<string>("");

  // Handler to add more couple inputs
  const addCoupleInput = () => {
    setCoupleInputs((prev) => [...prev, ""]);
  };

  // Handler to create a new tournament
  const createTournament = (e: React.FormEvent) => {
    e.preventDefault();

    const initialCouples: Couple[] = coupleInputs
      .filter((name) => name.trim() !== "")
      .map((name) => ({ id: uuidv4(), name }));

    if (initialCouples.length < 3) {
      setValidationError(
        "Al menos se necesitan 3 parejas para comenzar el torneo",
      );
      return;
    }

    setValidationError("");

    const newTournament = tournamentService.createTournament(
      tournamentName,
      initialCouples,
      numberOfCourts,
    );

    // Call the parent handler
    onTournamentCreated(newTournament, numberOfCourts);
  };

  return (
    <form
      onSubmit={createTournament}
      className="mt-4 min-w-[500px] max-w-lg rounded bg-white p-4 text-center text-black shadow-lg"
    >
      <h3 className="text-xl font-bold">CREAR TORNEO</h3>
      <p className="mb-4 text-sm">Ingresa los datos del torneo</p>

      {/* Tournament Name */}
      <label
        htmlFor="tournamentName"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Nombre del torneo
      </label>
      <input
        type="text"
        id="tournamentName"
        placeholder="Ej. Retas 3ra, 4ta, padel beer, etc."
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
        className="mb-4 w-full border p-2 text-center"
        required
      />

      {/* Number of Courts */}
      <label
        htmlFor="numberOfCourts"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Canchas Disponibles
      </label>
      <input
        type="number"
        id="numberOfCourts"
        min="1"
        placeholder="Number of Courts"
        value={numberOfCourts}
        onChange={(e) => setNumberOfCourts(parseInt(e.target.value))}
        className="mb-4 w-full border p-2"
        required
      />

      {/* Couple Inputs */}
      {coupleInputs.map((couple, index) => (
        <div key={index}>
          <label
            htmlFor={`couple-${index}`}
            className="mb-2 block text-left text-sm font-bold uppercase"
          >
            Pareja {index + 1}
          </label>
          <input
            type="text"
            id={`couple-${index}`}
            placeholder={`Ej. Ivan / Gabriel`}
            value={couple}
            onChange={(e) => {
              const newCoupleInputs = [...coupleInputs];
              newCoupleInputs[index] = e.target.value;
              setCoupleInputs(newCoupleInputs);
            }}
            className="mb-2 w-full border p-2"
          />
        </div>
      ))}

      {/* Add Couple Button */}
      <div className="flex">
        <button
          type="button"
          className="mt-2 rounded bg-secondary px-4 py-2 text-sm font-bold text-white"
          onClick={addCoupleInput}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Agregar pareja
        </button>
      </div>

      {/* Validation Error */}
      {validationError && (
        <p className="mt-2 text-red-500">{validationError}</p>
      )}

      {/* Submit Button */}
      <button
        className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
        type="submit"
      >
        Comenzar torneo
      </button>
    </form>
  );
};

export default TournamentForm;
