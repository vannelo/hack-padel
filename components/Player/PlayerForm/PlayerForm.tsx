"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@/components/UI/Button/Button";
import { Gender, Level } from "@/domain/models/Player";

interface PlayerFormProps {
  onPlayerCreated: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onPlayerCreated }) => {
  const [playerData, setPlayerData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: Gender.Indefinido,
    level: Level.Quinta,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const player = {
        ...playerData,
        id: uuidv4(),
      };

      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      });

      if (response.ok) {
        alert("Jugador creado correctamente");
        // Reset form fields
        setPlayerData({
          name: "",
          email: "",
          phone: "",
          gender: Gender.Indefinido,
          level: Level.Quinta,
        });
        onPlayerCreated();
      } else {
        // Handle server errors
        const errorData = await response.json();
        console.error("Error creating player:", errorData);
        alert("Error al crear el jugador");
      }
    } catch (error) {
      console.error("Error submitting player data:", error);
      alert("Error al enviar los datos del jugador");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed left-0 top-0 z-[999] flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={createPlayer}
        className="mt-4 min-w-[400px] max-w-lg rounded bg-white p-4 text-center text-black shadow-lg"
      >
        <h3 className="text-center text-xl font-bold">CREAR JUGADOR</h3>
        <p className="mb-8 text-sm">Ingresa los datos del jugador</p>
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
          className="mb-4 w-full border p-2 text-center"
          required
          disabled={isSubmitting}
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
          className="mb-4 w-full border p-2 text-center"
          disabled={isSubmitting}
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
          className="mb-4 w-full border p-2 text-center"
          disabled={isSubmitting}
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
          className="mb-4 w-full border p-2 text-center"
          disabled={isSubmitting}
        >
          <option value={Gender.Indefinido} disabled>
            Selecciona
          </option>
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
          className="mb-4 w-full border p-2 text-center"
          disabled={isSubmitting}
        >
          <option value={Level.Quinta}>Quinta</option>
          <option value={Level.Cuarta}>Cuarta</option>
          <option value={Level.Tercera}>Tercera</option>
          <option value={Level.Segunda}>Segunda</option>
          <option value={Level.Primera}>Primera</option>
        </select>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="mt-4 w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
        >
          Crear jugador
        </Button>
      </form>
    </div>
  );
};

export default PlayerForm;
