"use client";

import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import React, { useState } from "react";

import { deletePlayer, updatePlayer } from "@/app/actions/playerActions";
import Modal from "@/components/UI/Modal/Modal";
import { Player } from "@/domain/models/Player";
import { gridStyles } from "@/utils/constants";

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<Player>>({
    name: "",
    email: "",
    phone: "",
    gender: undefined,
    level: undefined,
    points: 0,
  });

  const handleRowClick = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
      setFormData({
        name: player.name,
        email: player.email || "",
        phone: player.phone || "",
        gender: player.gender,
        level: player.level,
        points: player.points ?? 0,
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!selectedPlayer) return;

    try {
      // eslint-disable-next-line
      await updatePlayer(selectedPlayer.id, formData);
      alert("Jugador actualizado exitosamente");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Hubo un error al actualizar el jugador");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      renderCell: (params) => (
        <span
          className="cursor-pointer text-primary underline"
          onClick={() => handleRowClick(params.row.id)}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {params.value ? (
            <span className="text-white">{params.value}</span>
          ) : (
            <span className="text-zinc-500">No especificado</span>
          )}
        </div>
      ),
    },
    {
      field: "phone",
      headerName: "Teléfono",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {params.value ? (
            <span className="text-white">{params.value}</span>
          ) : (
            <span className="text-zinc-500">No especificado</span>
          )}
        </div>
      ),
    },
    { field: "gender", headerName: "Género", flex: 1 },
    { field: "level", headerName: "Nivel", flex: 1 },
    {
      field: "points",
      headerName: "Puntos",
      flex: 1,
      renderCell: (params) => (
        <span className="text-white">{params.value || 0}</span>
      ),
    },
  ];

  const rows = players.map((player) => ({
    id: player.id,
    name: player.name,
    email: player.email,
    phone: player.phone,
    gender: player.gender,
    level: player.level,
  }));

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        disableRowSelectionOnClick
        sx={gridStyles}
      />
      {selectedPlayer && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          title={`Detalles del jugador: ${selectedPlayer.name}`}
        >
          {!isEditing ? (
            <div>
              <p>
                <strong>Email:</strong>{" "}
                {selectedPlayer.email || "No especificado"}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {selectedPlayer.phone || "No especificado"}
              </p>
              <p>
                <strong>Género:</strong> {selectedPlayer.gender}
              </p>
              <p>
                <strong>Nivel:</strong> {selectedPlayer.level}
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
                    if (
                      confirm(
                        `¿Estás seguro que deseas eliminar a ${selectedPlayer.name}?`,
                      )
                    ) {
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full border p-2"
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="block w-full border p-2"
                />
              </label>
              <label>
                Teléfono:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="block w-full border p-2"
                />
              </label>
              <label>
                Género:
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block w-full border p-2"
                >
                  <option value="Varonil">Varonil</option>
                  <option value="Femenil">Femenil</option>
                </select>
              </label>
              <label>
                Nivel:
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="block w-full border p-2"
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
      )}
    </div>
  );
};

export default PlayerList;
