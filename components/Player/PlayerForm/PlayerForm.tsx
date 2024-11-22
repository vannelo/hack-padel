"use client";

import React, { useState, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";
import { createPlayer } from "@/app/actions/playerActions";
import Button from "@/components/UI/Button/Button";
import { Gender, Level } from "@prisma/client";
import Divider from "@/components/UI/Divider/Divider";

interface PlayerFormProps {
  onPlayerCreated: () => void;
}

// TODO: Add form library and input components

const PlayerForm: React.FC<PlayerFormProps> = ({ onPlayerCreated }) => {
  const [playerData, setPlayerData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: Gender.Varonil,
    level: Level.Quinta,
  });
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const player = {
          ...playerData,
          id: uuidv4(),
        };
        await createPlayer(player);
        setPlayerData({
          name: "",
          email: "",
          phone: "",
          gender: Gender.Varonil,
          level: Level.Quinta,
        });

        onPlayerCreated();
      } catch (error) {
        console.error("Error submitting player data:", error);
        alert("Error al enviar los datos del jugador");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label
        htmlFor="name"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Nombre
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={playerData.name}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2 text-black"
        required
      />
      <label
        htmlFor="email"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Email (opcional)
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={playerData.email}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2 text-black"
      />
      <label
        htmlFor="phone"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Teléfono (opcional)
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={playerData.phone}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2 text-black"
      />
      <label
        htmlFor="gender"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Categoría (opcional)
      </label>
      <select
        id="gender"
        name="gender"
        value={playerData.gender}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2 text-black"
      >
        <option value={Gender.Varonil}>Varonil</option>
        <option value={Gender.Femenil}>Femenil</option>
      </select>
      <label
        htmlFor="level"
        className="mb-2 block text-left text-sm font-bold uppercase"
      >
        Nivel (opcional)
      </label>
      <select
        id="level"
        name="level"
        value={playerData.level}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2 text-black"
      >
        <option value={Level.Quinta}>Quinta</option>
        <option value={Level.Cuarta}>Cuarta</option>
        <option value={Level.Tercera}>Tercera</option>
        <option value={Level.Segunda}>Segunda</option>
        <option value={Level.Primera}>Primera</option>
      </select>
      <Divider />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isPending}>
          Crear
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-black"
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
    </form>
  );
};

export default PlayerForm;
