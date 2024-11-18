// @ts-nocheck

"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tournament } from "@prisma/client";
import Link from "next/link";

interface TournamentTableProps {
  tournaments: Tournament[];
}

const TournamentTable: React.FC<TournamentTableProps> = ({ tournaments }) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Torneo",
      flex: 1,
      renderCell: (params) => (
        <Link
          href={`/torneos/${params.row.id}`}
          className="w-full text-primary"
        >
          {params.value}
        </Link>
      ),
    },
    { field: "winners", headerName: "Ganadores", flex: 1 },
    { field: "couples", headerName: "Parejas", flex: 1 },
    { field: "date", headerName: "Fecha", flex: 1 },
  ];

  const rows = tournaments.map((tournament) => {
    const coupleNames = tournament.winners.map(
      (couple) => couple.player1.name + " / " + couple.player2.name,
    );

    return {
      id: tournament.id,
      name: tournament.name,
      winners: tournament.winners.length > 0 ? coupleNames : "-",
      couples: tournament.couples.length,
      date: new Date(tournament.createdAt).toLocaleDateString(),
    };
  });

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

export default TournamentTable;
