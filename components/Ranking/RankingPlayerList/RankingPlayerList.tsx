"use client";

import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Player } from "@/domain/models/Player";
import { gridStyles } from "@/utils/constants";
import Button from "@/components/UI/Button/Button";

interface RankingPlayerListProps {
  players: Player[];
}

const RankingPlayerList: React.FC<RankingPlayerListProps> = ({ players }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Quinta");

  const categories = ["Quinta", "Cuarta", "Tercera", "Segunda", "Primera"];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "gender", headerName: "Género", flex: 1 },
    { field: "level", headerName: "Nivel", flex: 1 },
    { field: "points", headerName: "Puntos", flex: 1 },
  ];

  // Filter players by the selected category
  const filteredPlayers = players.filter(
    (player) => player.level === selectedCategory,
  );

  const rows = filteredPlayers.map((player) => ({
    id: player.id,
    name: player.name,
    gender: player.gender,
    level: player.level,
    points: player.points,
  }));

  return (
    <div style={{ width: "100%" }}>
      <div className="mb-4 flex items-center justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`${
              selectedCategory === category ? "text-primary" : "text-white"
            } mr-2 min-w-40 rounded-3xl border px-4 py-2 font-bold`}
          >
            {category}
          </button>
        ))}
      </div>
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
