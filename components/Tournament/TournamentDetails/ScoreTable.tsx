import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Tournament } from "@/domain/models/Tournament";

interface ScoreTableProps {
  tournament: Tournament;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ tournament }) => {
  const columns: GridColDef[] = [
    { field: "couple", headerName: "Pareja", flex: 1 },
    ...tournament.couples.map((couple, index) => ({
      field: `opponent${index}`,
      headerName: `vs ${couple.player1.name}/${couple.player2.name}`,
      width: 120,
      renderCell: (params: any) => {
        const score = params.value as string;
        return score === "-" ? (
          score
        ) : (
          <span className="font-bold">{score}</span>
        );
      },
    })),
    { field: "totalScore", headerName: "Puntuación Total", width: 150 },
  ];

  const rows = tournament.couples.map((couple, index) => {
    const row: any = {
      id: couple.id,
      couple: `${couple.player1.name}/${couple.player2.name}`,
    };

    tournament.couples.forEach((opponent, opponentIndex) => {
      if (index === opponentIndex) {
        row[`opponent${opponentIndex}`] = "-";
      } else {
        const score = getScoreAgainstOpponent(
          tournament,
          couple.id,
          opponent.id,
        );
        row[`opponent${opponentIndex}`] = score;
      }
    });

    row.totalScore = calculateTotalScore(tournament, couple.id);

    return row;
  });

  const gridStyles = {
    "& .MuiDataGrid-root": {
      backgroundColor: "#1F2937",
      color: "white",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#374151",
    },
    "& .MuiDataGrid-cell": {
      borderColor: "#4B5563",
    },
    "& .MuiTablePagination-root": {
      color: "white",
    },
  };

  return (
    <div
      style={{ height: 400, width: "100%", color: "white" }}
      className="text-white"
    >
      <DataGrid rows={rows} columns={columns} sx={gridStyles} />
    </div>
  );
};

function getScoreAgainstOpponent(
  tournament: Tournament,
  coupleId: string,
  opponentId: string,
): string {
  let score = 0;
  tournament.rounds.forEach((round) => {
    const match = round.matches.find(
      (m) =>
        (m.couple1Id === coupleId && m.couple2Id === opponentId) ||
        (m.couple1Id === opponentId && m.couple2Id === coupleId),
    );
    if (match) {
      if (match.couple1Id === coupleId) {
        score += match.couple1Score;
      } else {
        score += match.couple2Score;
      }
    }
  });
  return score.toString();
}

function calculateTotalScore(tournament: Tournament, coupleId: string): number {
  let totalScore = 0;
  tournament.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (match.couple1Id === coupleId) {
        totalScore += match.couple1Score;
      } else if (match.couple2Id === coupleId) {
        totalScore += match.couple2Score;
      }
    });
  });
  return totalScore;
}

export default ScoreTable;
