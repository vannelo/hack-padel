"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Player } from "@/domain/models/Player";
import { gridStyles } from "@/utils/constants";

interface PlayerListProps {
  players: Player[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
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
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={gridStyles}
      />
    </div>
  );
};

export default PlayerList;
