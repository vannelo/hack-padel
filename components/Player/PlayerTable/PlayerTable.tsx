"use client";

import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { updatePlayer } from "@/app/actions/playerActions";
import { Player } from "@/domain/models/Player";
import { useNotification } from "@/providers/NotificationContext";
import { gridStyles } from "@/utils/constants";

import PlayerInfoModal from "../PlayerInfoModal/PlayerInfoModal";

interface PlayerTableProps {
  players: Player[];
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notify } = useNotification();
  const router = useRouter();

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
      await updatePlayer(selectedPlayer.id, formData);
      handleCloseModal();
      notify({
        message: "Jugador creado correctamente",
        severity: "success",
      });

      router.refresh();
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Hubo un error al actualizar el jugador");
    }
  };

  const filteredPlayers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(query) ||
        (player.email && player.email.toLowerCase().includes(query)) ||
        (player.phone && player.phone.toLowerCase().includes(query)),
    );
  }, [searchQuery, players]);

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
    },
  ];

  const rows = filteredPlayers.map((player) => ({
    id: player.id,
    name: player.name,
    email: player.email,
    phone: player.phone,
    gender: player.gender,
    level: player.level,
    points: player.points,
  }));

  return (
    <div style={{ width: "100%" }}>
      <div className="mb-4">
        <h3 className="mb-2 text-lg font-bold text-white">Buscador</h3>
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-white"
        />
      </div>
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
        <PlayerInfoModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          selectedPlayer={selectedPlayer}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSaveChanges={handleSaveChanges}
        />
      )}
    </div>
  );
};

export default PlayerTable;
