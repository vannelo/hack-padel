"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Player } from "@/domain/models/Player";
import { gridStyles } from "@/utils/constants";

interface RankingPlayerListProps {
  players: Player[];
}

const RankingPlayerList: React.FC<RankingPlayerListProps> = ({ players }) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "gender", headerName: "Género", flex: 1 },
    { field: "level", headerName: "Nivel", flex: 1 },
    { field: "points", headerName: "Puntos", flex: 1 },
  ];

  const rows = players.map((player) => ({
    id: player.id,
    name: player.name,
    gender: player.gender,
    level: player.level,
    points: player.points,
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

export default RankingPlayerList;
