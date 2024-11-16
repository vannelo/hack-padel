"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Couple } from "@/domain/models/Couple";
import { tournamentService } from "@/domain";
import { Tournament } from "@/domain/models/Tournament";
import Button from "@/components/UI/Button/Button";

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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const addCoupleInput = () => {
    setCoupleInputs((prev) => [...prev, ""]);
  };

  const createTournament = async (e: React.FormEvent) => {
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
    setIsSubmitting(true);

    try {
      const newTournament = tournamentService.createTournament(
        tournamentName,
        initialCouples,
        numberOfCourts,
      );

      await onTournamentCreated(newTournament, numberOfCourts);
    } catch (error) {
      console.error("Error in createTournament:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={createTournament}
      className="mt-4 min-w-[400px] max-w-lg rounded bg-white p-4 text-center text-black shadow-lg"
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
        className="mb-4 w-full border p-2 text-center"
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
            placeholder="Ej. Ivan / Gabriel"
            value={couple}
            onChange={(e) => {
              const newCoupleInputs = [...coupleInputs];
              newCoupleInputs[index] = e.target.value;
              setCoupleInputs(newCoupleInputs);
            }}
            className="mb-2 w-full border p-2"
            disabled={isSubmitting}
          />
        </div>
      ))}
      <div className="flex">
        <button
          type="button"
          className="mt-2 rounded bg-secondary px-4 py-2 text-sm font-bold text-white"
          onClick={addCoupleInput}
          disabled={isSubmitting}
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
      {validationError && (
        <p className="mt-2 text-red-500">{validationError}</p>
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
