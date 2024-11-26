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
    <form onSubmit={handleSubmit} className="text-black">
      <label htmlFor="name" className="mb-2 block text-left text-sm font-bold">
        Nombre
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={playerData.name}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2"
        required
      />
      <label htmlFor="email" className="mb-2 block text-left text-sm font-bold">
        Email (opcional)
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={playerData.email}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2"
      />
      <label htmlFor="phone" className="mb-2 block text-left text-sm font-bold">
        Teléfono (opcional)
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={playerData.phone}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2"
      />
      <label
        htmlFor="gender"
        className="mb-2 block text-left text-sm font-bold"
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
      <label htmlFor="level" className="mb-2 block text-left text-sm font-bold">
        Nivel (opcional)
      </label>
      <select
        id="level"
        name="level"
        value={playerData.level}
        onChange={handleInputChange}
        className="mb-4 w-full border p-2"
      >
        <option value={Level.Quinta}>Quinta</option>
        <option value={Level.Cuarta}>Cuarta</option>
        <option value={Level.Tercera}>Tercera</option>
        <option value={Level.Segunda}>Segunda</option>
        <option value={Level.Primera}>Primera</option>
      </select>
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

export default PlayerForm;
