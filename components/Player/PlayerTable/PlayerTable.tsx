"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Player } from "@/domain/models/Player";

interface PlayerTableProps {
  players: Player[];
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Teléfono", flex: 1 },
    { field: "gender", headerName: "Género", flex: 1 },
    { field: "level", headerName: "Nivel", flex: 1 },
  ];

  const rows = players.map((player) => ({
    id: player.id,
    name: player.name,
    email: player.email || "No especificado",
    phone: player.phone || "No especificado",
    gender: player.gender,
    level: player.level,
  }));

  const gridStyles = {
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#c0ff00",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "black",
      fontWeight: "bold",
    },
    "& .MuiDataGrid-cell": {
      color: "white",
    },
    "& .MuiDataGrid-row": {
      "&:nth-of-type(odd)": {
        backgroundColor: "#222",
      },
    },
    "& .MuiTablePagination-root": {
      color: "#c0ff00",
    },
    fontWeight: "bold",
  };

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

export default PlayerTable;
