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
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = [
    "Todos",
    "Quinta",
    "Cuarta",
    "Tercera",
    "Segunda",
    "Primera",
  ];

  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "level", headerName: "Categoría", flex: 1 },
    { field: "points", headerName: "Puntos", flex: 1 },
  ];

  const filteredPlayers =
    selectedCategory === "Todos"
      ? players
      : players.filter((player) => player.level === selectedCategory);

  const rows = filteredPlayers.map((player) => ({
    id: player.id,
    name: player.name,
    gender: player.gender,
    level: player.level,
    points: player.points,
  }));

  return (
    <div style={{ width: "100%" }}>
      <div className="mb-4 block lg:hidden">
        <label
          htmlFor="category-select"
          className="mb-2 block text-center text-sm font-bold text-white"
        >
          Filtrar por Categoría
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded border border-gray-500 bg-black p-2 text-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 hidden items-center justify-center lg:flex">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`mx-2 border border-black px-4 ${
              selectedCategory === category
                ? "border-b-primary text-primary"
                : "text-white"
            }`}
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
