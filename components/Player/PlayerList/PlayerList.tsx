"use client";

import React, { useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Player } from "@/domain/models/Player";
import { gridStyles } from "@/utils/constants";
import Modal from "@/components/UI/Modal/Modal";
import { deletePlayer } from "@/app/actions/playerActions";

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

  const handleRowClick = (playerId: string) => {
    const player = players.find((p) => p.id === playerId);
    if (player) {
      setSelectedPlayer(player);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    setIsModalOpen(false);
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

      {/* Modal for Player Details */}
      {selectedPlayer && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          title={`Detalles del jugador: ${selectedPlayer.name}`}
        >
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
            <button
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
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
        </Modal>
      )}
    </div>
  );
};

export default PlayerList;
