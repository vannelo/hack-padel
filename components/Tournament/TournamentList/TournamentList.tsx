"use client";

import React, { useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Tournament } from "@/domain/models/Tournament";
import Link from "next/link";
import { gridStyles } from "@/utils/constants";
import Modal from "@/components/UI/Modal/Modal";
import { deleteTournament } from "@/app/actions/tournamentActions";

interface TournamentListProps {
  tournaments: Tournament[];
  isAdmin?: boolean;
}

const TournamentList: React.FC<TournamentListProps> = ({
  tournaments,
  isAdmin = false,
}) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 50,
    page: 0,
  });
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (tournamentId: string) => {
    const tournament = tournaments.find((p) => p.id === tournamentId);
    if (tournament) {
      setSelectedTournament(tournament);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedTournament(null);
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
      field: "activeRound",
      headerName: "Ronda Activa",
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
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        disableRowSelectionOnClick
        sx={gridStyles}
      />
      {selectedTournament && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          title={`Detalles del torneo: ${selectedTournament.name}`}
        >
          <div>
            <p>
              <strong>Canchas:</strong> {selectedTournament.courts}
            </p>
            <p>
              <strong>Parejas:</strong>{" "}
              {selectedTournament.couples
                ? selectedTournament.couples.length
                : 0}
            </p>
            <button
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
              onClick={async () => {
                if (
                  confirm(
                    `¿Estás seguro que deseas eliminar a ${selectedTournament.name}?`,
                  )
                ) {
                  await deleteTournament(selectedTournament.id);
                  alert("Jugador eliminado exitosamente");
                  handleCloseModal();
                }
              }}
            >
              Eliminar Torneo
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TournamentList;
