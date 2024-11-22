"use client";

import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Tournament } from "@/domain/models/Tournament";
import Link from "next/link";

interface TournamentListProps {
  tournaments: Tournament[];
}

const TournamentList: React.FC<TournamentListProps> = ({ tournaments }) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/torneos/${params.row.id}`}
          passHref
          className="hover:text-primary"
        >
          {params.value}
        </Link>
      ),
    },
    { field: "courts", headerName: "Canchas", flex: 1 },
    { field: "couples", headerName: "Parejas", flex: 1 },
    { field: "rounds", headerName: "Rondas", flex: 1 },
    { field: "activeRound", headerName: "Ronda Activa", flex: 1 },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/torneos/${params.row.id}`}
          passHref
          className="hover:text-primary"
        >
          Ver Torneo
        </Link>
      ),
    },
  ];

  const rows = tournaments.map((tournament) => ({
    id: tournament.id,
    name: tournament.name,
    courts: tournament.courts,
    couples: tournament.couples ? tournament.couples.length : 0,
    rounds: tournament.rounds ? tournament.rounds.length : 0,
    activeRound:
      tournament.rounds && tournament.rounds.length > 0
        ? tournament.rounds.findIndex((round) => round.isActive) + 1 ||
          "Finalizado"
        : "Finalizado",
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

export default TournamentList;
