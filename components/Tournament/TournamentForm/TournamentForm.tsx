"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { createTournament } from "@/app/actions/tournamentActions";
import Button from "@/components/UI/Button/Button";
import { Player } from "@/domain/models/Player";
import { Couple } from "@/domain/models/Couple";
import { getAllPlayers } from "@/app/actions/playerActions";
import Divider from "@/components/UI/Divider/Divider";

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
  const [openDropdown, setOpenDropdown] = useState<{
    index: number;
    player: "player1" | "player2";
  } | null>(null);
  const [searchInputs, setSearchInputs] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    const fetchPlayers = async () => {
      const fetchedPlayers = await getAllPlayers();
      setPlayers(fetchedPlayers);
    };
    fetchPlayers();
  }, []);

  const selectedPlayerIds = useMemo(() => {
    return couples.flatMap((couple) => [couple.player1Id, couple.player2Id]);
  }, [couples]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setTournamentData((prevData) => ({
      ...prevData,
      [name]: name === "courts" ? parseInt(value) : value,
    }));
  };

  const handleAddCouple = () => {
    const newCouple: any = {
      id: uuidv4(),
      player1Id: "",
      player1: { id: "", name: "", gender: "", level: "" },
      player2Id: "",
      player2: { id: "", name: "", gender: "", level: "" },
      tournamentId: "",
    };
    setCouples([...couples, newCouple]);
  };

  const handleCoupleChange = (
    index: number,
    playerKey: "player1" | "player2",
    playerId: string,
    playerName: string,
  ) => {
    const updatedCouples = [...couples];
    const player = players.find((p) => p.id === playerId) || {
      id: playerId,
      name: playerName,
    };
    // @ts-ignore
    updatedCouples[index][playerKey] = player;
    updatedCouples[index][`${playerKey}Id`] = playerId;
    setCouples(updatedCouples);
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

  const filterPlayers = (
    input: string,
    coupleIndex: number,
    playerKey: "player1" | "player2",
  ) => {
    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(input.toLowerCase()) &&
        !selectedPlayerIds.includes(player.id) &&
        player.id !==
          couples[coupleIndex][
            playerKey === "player1" ? "player2Id" : "player1Id"
          ],
    );
  };

  return (
    <form onSubmit={handleSubmit} className="text-black">
      <label htmlFor="name" className="mb-2 block text-left text-sm font-bold">
        Nombre del torneo
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={tournamentData.name}
        onChange={handleInputChange}
        className="mb-4 w-full rounded border p-2 text-black"
        required
      />
      <label
        htmlFor="courts"
        className="mb-2 block text-left text-sm font-bold"
      >
        Canchas disponibles
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
                ? "border-black bg-black text-white"
                : "border-white bg-white text-black"
            }`}
          >
            {court}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="mb-2 text-left text-sm font-bold">Parejas</h3>
        {couples.map((couple, index) => (
          <div key={couple.id} className="mb-2">
            <div className="flex space-x-2">
              {(["player1", "player2"] as const).map((playerKey) => (
                <div key={playerKey} className="relative w-1/2">
                  <input
                    type="text"
                    value={couple[playerKey].name}
                    onChange={(e) => {
                      setSearchInputs({
                        ...searchInputs,
                        [`${index}-${playerKey}`]: e.target.value,
                      });
                      handleCoupleChange(index, playerKey, "", e.target.value);
                      setOpenDropdown({ index, player: playerKey });
                    }}
                    onFocus={() =>
                      setOpenDropdown({ index, player: playerKey })
                    }
                    onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                    className="w-full rounded border p-2 text-sm text-black"
                    placeholder={`Jugador ${playerKey === "player1" ? "1" : "2"}`}
                    required
                  />
                  {openDropdown?.index === index &&
                    openDropdown.player === playerKey &&
                    searchInputs[`${index}-${playerKey}`]?.length >= 3 && (
                      <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto border border-gray-300 bg-white text-black">
                        {filterPlayers(
                          searchInputs[`${index}-${playerKey}`] || "",
                          index,
                          playerKey,
                        ).map((filteredPlayer) => (
                          <li
                            key={filteredPlayer.id}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleCoupleChange(
                                index,
                                playerKey,
                                filteredPlayer.id,
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
        <div className="flex justify-start">
          <Button type="button" onClick={handleAddCouple} variant="secondary">
            Agregar pareja
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-black"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 00-1 1v6H3a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending} variant="dark">
          Crear
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black">
            <svg
              className="h-3 w-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </Button>
      </div>
    </form>
  );
};

export default TournamentForm;
