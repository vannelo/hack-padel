"use client";

import React, { useState, useTransition, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { getAllPlayers } from "@/app/actions/playerActions";
import { createTournament } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";
import TableLoader from "@/components/UI/TableLoader/TableLoader";

interface TournamentFormProps {
  onTournamentCreated: () => void;
}

interface Player {
  id: string;
  name: string;
}

const TournamentForm: React.FC<TournamentFormProps> = ({
  onTournamentCreated,
}) => {
  const [tournamentData, setTournamentData] = useState({
    name: "",
    numberOfCourts: 1,
    couples: [
      {
        id: uuidv4(),
        tournamentId: "",
        player1Id: "",
        player2Id: "",
        player1Name: "",
        player2Name: "",
      },
    ],
  });
  const [validationError, setValidationError] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [openDropdown, setOpenDropdown] = useState<{
    index: number;
    player: "player1" | "player2";
  } | null>(null);

  const { data: players, isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["players"],
    queryFn: getAllPlayers,
  });

  const selectedPlayerIds = useMemo(() => {
    return tournamentData.couples.flatMap((couple) =>
      [couple.player1Id, couple.player2Id].filter(Boolean),
    );
  }, [tournamentData.couples]);

  const addCouple = () => {
    setTournamentData((prevData) => ({
      ...prevData,
      couples: [
        ...prevData.couples,
        {
          id: uuidv4(),
          tournamentId: "",
          player1Id: "",
          player2Id: "",
          player1Name: "",
          player2Name: "",
        },
      ],
    }));
  };

  const handleCoupleChange = (
    index: number,
    key: "player1Id" | "player2Id" | "player1Name" | "player2Name",
    value: string,
  ) => {
    setTournamentData((prevData) => {
      const updatedCouples = [...prevData.couples];
      updatedCouples[index][key] = value;

      // If changing ID, update name as well
      if (key === "player1Id" || key === "player2Id") {
        const nameKey = key === "player1Id" ? "player1Name" : "player2Name";
        const player = players?.find((p) => p.id === value);
        if (player) {
          updatedCouples[index][nameKey] = player.name;
        }
      }

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

  const filterPlayers = (
    input: string,
    coupleIndex: number,
    playerKey: "player1" | "player2",
  ) => {
    if (!players) return [];
    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedPlayerIds.includes(player.id) &&
        player.id !==
          tournamentData.couples[coupleIndex][
            `${playerKey === "player1" ? "player2" : "player1"}Id`
          ],
    );
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
        <div key={couple.id} className="mb-4">
          <h4 className="mb-2 text-left text-sm font-bold uppercase">
            Pareja {index + 1}
          </h4>
          <div className="flex space-x-2">
            {(["player1", "player2"] as const).map((player) => (
              <div key={player} className="relative w-1/2">
                <input
                  type="text"
                  value={couple[`${player}Name`]}
                  onChange={(e) => {
                    handleCoupleChange(index, `${player}Name`, e.target.value);
                    handleCoupleChange(index, `${player}Id`, "");
                    setOpenDropdown({ index, player });
                  }}
                  onFocus={() => setOpenDropdown({ index, player })}
                  onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                  className="w-full border p-2 text-sm"
                  placeholder={`Jugador ${player === "player1" ? "1" : "2"}`}
                  required
                />
                {openDropdown?.index === index &&
                  openDropdown.player === player &&
                  couple[`${player}Name`].length >= 3 && (
                    <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto border border-gray-300 bg-white">
                      {filterPlayers(
                        couple[`${player}Name`],
                        index,
                        player,
                      ).map((filteredPlayer) => (
                        <li
                          key={filteredPlayer.id}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleCoupleChange(
                              index,
                              `${player}Id`,
                              filteredPlayer.id,
                            );
                            handleCoupleChange(
                              index,
                              `${player}Name`,
                              filteredPlayer.name,
                            );
                            setOpenDropdown(null);
                          }}
                        >
                          {filteredPlayer.name}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
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
