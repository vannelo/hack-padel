import React from "react";
import { Tournament } from "@/domain/models/Tournament";
import CoupleName from "@/components/UI/CoupleName/CoupleName";
import {
  calculateTotalScores,
  identifyLeaders,
  findMatchBetweenCouples,
} from "@/utils/tournamentUtils";

interface ScoreTableProps {
  tournament: Tournament;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ tournament }) => {
  const totalScores = calculateTotalScores(tournament);
  const leaders = identifyLeaders(tournament, totalScores);

  const renderCell = (couple: any, opponent: any) => {
    if (couple.id === opponent.id) {
      return <td className="border border-zinc-600 p-2 text-center">-</td>;
    }

    const match = findMatchBetweenCouples(tournament, couple.id, opponent.id);
    let content = "-";
    let isWinner = false;

    if (match) {
      const coupleScore =
        couple.id === match.couple1Id ? match.couple1Score : match.couple2Score;
      const opponentScore =
        couple.id === match.couple1Id ? match.couple2Score : match.couple1Score;

      content = coupleScore === null ? "?" : coupleScore.toString();

      if (coupleScore !== undefined && opponentScore !== undefined) {
        if (coupleScore > opponentScore) {
          isWinner = true;
        }
      }
    }

    return (
      <td
        className={`border border-zinc-600 p-2 text-center ${isWinner ? "text-primary" : ""}`}
      >
        {content}
      </td>
    );
  };

  return (
    <div className="mb-4 overflow-x-auto rounded-3xl border border-zinc-600 text-white">
      <table className="text-md w-full table-auto border-collapse font-bold">
        <thead>
          <tr>
            <th className="border border-black border-b-zinc-600 border-r-zinc-600">
              Parejas
            </th>
            {tournament.couples.map((couple, index) => (
              <th
                key={index}
                className="border border-black border-b-zinc-600 border-r-zinc-600 p-2"
              >
                <CoupleName couple={couple} />
              </th>
            ))}
            <th className="border border-black border-b-zinc-600 border-l-zinc-600">
              Puntos
            </th>
          </tr>
        </thead>
        <tbody>
          {tournament.couples.map((couple) => (
            <tr key={couple.id}>
              <td
                className={`border border-black border-b-zinc-600 border-r-zinc-600 p-2 ${
                  leaders.includes(couple.id) ? "text-primary" : ""
                }`}
              >
                <CoupleName couple={couple} />
              </td>
              {tournament.couples.map((opponent) =>
                renderCell(couple, opponent),
              )}
              <td
                className={`border border-black border-b-zinc-600 p-2 text-center font-bold ${
                  leaders.includes(couple.id) ? "text-primary" : ""
                }`}
              >
                {totalScores.get(couple.id)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
