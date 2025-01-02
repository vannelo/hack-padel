"use client";

import React, { useState } from "react";

import { deletePlayer } from "@/app/actions/playerActions";
import Modal from "@/components/UI/Modal/Modal";
import { Player } from "@/domain/models/Player";

interface PlayerInfoModalProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  selectedPlayer: Player;
  formData: Partial<Player>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleSaveChanges: () => void;
}

const PlayerInfoModal: React.FC<PlayerInfoModalProps> = ({
  isModalOpen,
  handleCloseModal,
  selectedPlayer,
  formData,
  handleInputChange,
  handleSaveChanges,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { email, phone, gender, level } = selectedPlayer;
  const {
    name: formName,
    email: formEmail,
    phone: formPhone,
    gender: formGender,
    level: formLevel,
  } = formData;

  return (
    <Modal
      open={isModalOpen}
      onClose={handleCloseModal}
      title={`Detalles del jugador: ${name}`}
    >
      {!isEditing ? (
        <div>
          <p>
            <strong>Email:</strong> {email || "No especificado"}
          </p>
          <p>
            <strong>Teléfono:</strong>
            {phone || "No especificado"}
          </p>
          <p>
            <strong>Género:</strong> {gender}
          </p>
          <p>
            <strong>Nivel:</strong> {level}
          </p>
          <div className="flex items-center justify-between">
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white"
              onClick={() => setIsEditing(true)}
            >
              Editar Jugador
            </button>
            <button
              className="text-red-600 underline"
              onClick={async () => {
                if (confirm(`¿Estás seguro que deseas eliminar a ${name}?`)) {
                  await deletePlayer(selectedPlayer.id);
                  alert("Jugador eliminado exitosamente");
                  handleCloseModal();
                }
              }}
            >
              Eliminar Jugador
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={formName}
              onChange={handleInputChange}
              className="block w-full border p-2 text-black"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formEmail || ""}
              onChange={handleInputChange}
              className="block w-full border p-2 text-black"
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="phone"
              value={formPhone || ""}
              onChange={handleInputChange}
              className="block w-full border p-2 text-black"
            />
          </label>
          <label>
            Género:
            <select
              name="gender"
              value={formGender}
              onChange={handleInputChange}
              className="block w-full border p-2 text-black"
            >
              <option value="Varonil">Varonil</option>
              <option value="Femenil">Femenil</option>
            </select>
          </label>
          <label>
            Nivel:
            <select
              name="level"
              value={formLevel}
              onChange={handleInputChange}
              className="block w-full border p-2 text-black"
            >
              <option value="Quinta">Quinta</option>
              <option value="Cuarta">Cuarta</option>
              <option value="Tercera">Tercera</option>
              <option value="Segunda">Segunda</option>
              <option value="Primera">Primera</option>
            </select>
          </label>
          <button
            className="mt-4 rounded bg-green-500 px-4 py-2 text-white"
            onClick={handleSaveChanges}
          >
            Guardar Cambios
          </button>
          <button
            className="ml-4 mt-4 rounded bg-gray-500 px-4 py-2 text-white"
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </Modal>
  );
};

export default PlayerInfoModal;
