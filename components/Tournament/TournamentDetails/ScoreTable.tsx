import React from "react";
import { Tournament } from "@/domain/models/Tournament";
import { calculateTotalScore } from "@/utils/helpers";
import CoupleName from "@/components/UI/CoupleName/CoupleName";

interface ScoreTableProps {
  tournament: Tournament;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ tournament }) => {
  // Calculate total scores for each couple
  const totalScores = new Map<string, number>();
  tournament.couples.forEach((couple) => {
    const totalScore = calculateTotalScore(tournament, couple.id);
    totalScores.set(couple.id, totalScore);
  });

  // Find the highest score
  let highestScore = 0;
  totalScores.forEach((score) => {
    if (score > highestScore) {
      highestScore = score;
    }
  });

  // Identify leading couples
  const leaders = tournament.couples
    .filter((couple) => totalScores.get(couple.id) === highestScore)
    .map((couple) => couple.id);

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
          {tournament.couples.map((couple, rowIndex) => (
            <tr key={rowIndex}>
              <td
                className={`border border-black border-b-zinc-600 border-r-zinc-600 p-2 ${
                  leaders.includes(couple.id) ? "text-primary" : ""
                }`}
              >
                <CoupleName couple={couple} />
              </td>
              {tournament.couples.map((opponent, colIndex) => {
                if (rowIndex === colIndex) {
                  // Same couple, show a dash
                  return (
                    <td
                      key={colIndex}
                      className="border border-zinc-600 p-2 text-center"
                    >
                      -
                    </td>
                  );
                } else {
                  // Find match between these two couples
                  let match = null;
                  for (const round of tournament.rounds) {
                    match = round.matches.find(
                      (m) =>
                        (m.couple1Id === couple.id &&
                          m.couple2Id === opponent.id) ||
                        (m.couple1Id === opponent.id &&
                          m.couple2Id === couple.id),
                    );
                    if (match) break;
                  }

                  let content = "-";
                  let isWinner = false;

                  if (match) {
                    const coupleScore =
                      couple.id === match.couple1Id
                        ? match.couple1Score
                        : match.couple2Score;
                    const opponentScore =
                      couple.id === match.couple1Id
                        ? match.couple2Score
                        : match.couple1Score;

                    content =
                      coupleScore === null ? "?" : coupleScore.toString();

                    if (
                      coupleScore !== undefined &&
                      opponentScore !== undefined
                    ) {
                      if (coupleScore > opponentScore) {
                        isWinner = true;
                      }
                    }
                  }

                  return (
                    <td
                      key={colIndex}
                      className={`border border-zinc-600 p-2 text-center ${
                        isWinner ? "text-primary" : ""
                      }`}
                    >
                      {content}
                    </td>
                  );
                }
              })}
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
