import React from "react";
import { Tournament } from "@/domain/models/Tournament";

interface ScoreTableProps {
  tournament: Tournament;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ tournament }) => {
  const totalScores = new Map<string, number>();
  tournament.couples.forEach((couple) => {
    const totalScore = calculateTotalScore(tournament, couple.id);
    totalScores.set(couple.id, totalScore);
  });

  let highestScore = 0;
  totalScores.forEach((score) => {
    if (score > highestScore) {
      highestScore = score;
    }
  });

  const leaders = tournament.couples
    .filter((couple) => totalScores.get(couple.id) === highestScore)
    .map((couple) => couple.id);

  const getCoupleName = (couple: any) =>
    `${couple.player1.name}/${couple.player2.name}`;

  return (
    <div className="overflow-x-auto text-white">
      <table className="w-full table-auto border-collapse border border-gray-600 text-sm font-bold md:text-lg">
        <thead>
          <tr>
            <th className="border border-gray-600 p-2 text-primary md:p-4">
              Parejas
            </th>
            {tournament.couples.map((couple, index) => (
              <th
                key={index}
                className="truncate border border-gray-600 p-2 md:p-4"
              >
                {getCoupleName(couple)}
              </th>
            ))}
            <th className="border border-gray-600 p-2 text-primary md:p-4">
              Puntos
            </th>
          </tr>
        </thead>
        <tbody>
          {tournament.couples.map((couple, rowIndex) => (
            <tr key={rowIndex}>
              <td
                className={`border border-gray-600 p-2 font-bold md:p-4 ${
                  leaders.includes(couple.id) ? "text-primary" : ""
                }`}
              >
                {getCoupleName(couple)}
              </td>
              {tournament.couples.map((opponent, colIndex) => {
                if (rowIndex === colIndex) {
                  return (
                    <td
                      key={colIndex}
                      className="border border-gray-600 p-2 text-center md:p-4"
                    >
                      -
                    </td>
                  );
                } else {
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

                    content = coupleScore ? coupleScore.toString() : "?";

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
                      className={`border border-gray-600 p-2 text-center md:p-4 ${
                        isWinner ? "text-primary" : ""
                      }`}
                    >
                      {content}
                    </td>
                  );
                }
              })}
              <td
                className={`border border-gray-600 p-2 text-center font-bold md:p-4 ${
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
