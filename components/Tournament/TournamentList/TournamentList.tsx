"use client";

import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Tournament } from "@/domain/models/Tournament";
import Link from "next/link";
import { gridStyles } from "@/utils/constants";

interface TournamentListProps {
  tournaments: Tournament[];
  isAdmin?: boolean;
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  isAdmin = false,
}) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/${
            isAdmin
              ? `admin/torneos/${params.row.id}`
              : `ranking/torneos/${params.row.id}`
          }`}
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
    {
      field: "activeRound",
      headerName: "Estado",
      flex: 1,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {params.value === "Finalizado" ? (
            <span className="text-zinc-500">Finalizado</span>
          ) : (
            <span className="text-white">{params.value}</span>
          )}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Link
          href={`/${
            isAdmin
              ? `admin/torneos/${params.row.id}`
              : `ranking/torneos/${params.row.id}`
          }`}
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
