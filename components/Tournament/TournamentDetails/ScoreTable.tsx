import React from "react";
import { Tournament } from "@/domain/models/Tournament";

interface ScoreTableProps {
  tournament: Tournament;
}

const ScoreTable: React.FC<ScoreTableProps> = ({ tournament }) => {
  console.log("tournament", tournament);
  // Compute total scores for each couple
  const totalScores = new Map<string, number>();
  tournament.couples.forEach((couple) => {
    const totalScore = calculateTotalScore(tournament, couple.id);
    totalScores.set(couple.id, totalScore);
  });

  // Determine the highest score to identify leaders
  let highestScore = 0;
  totalScores.forEach((score) => {
    if (score > highestScore) {
      highestScore = score;
    }
  });

  // Identify leaders based on the highest score
  const leaders = tournament.couples
    .filter((couple) => totalScores.get(couple.id) === highestScore)
    .map((couple) => couple.id);

  // Helper function to get the couple's display name
  const getCoupleName = (couple: any) =>
    `${couple.player1.name}/${couple.player2.name}`;

  return (
    <div className="text-white">
      <table className="w-full table-auto border-collapse border border-gray-400 text-lg font-bold">
        {/* Table header */}
        <thead>
          <tr>
            <th className="border border-gray-400 p-4 text-primary">Parejas</th>
            {tournament.couples.map((couple, index) => (
              <th key={index} className="border border-gray-400 p-4">
                {getCoupleName(couple)}
              </th>
            ))}
            <th className="border border-gray-400 p-4 text-primary">Puntos</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody className="text-lg">
          {tournament.couples.map((couple, rowIndex) => (
            <tr key={rowIndex}>
              {/* First cell: Couple Name */}
              <td
                className={`border border-gray-400 p-4 font-bold ${
                  leaders.includes(couple.id) ? "text-primary" : ""
                }`}
              >
                {getCoupleName(couple)}
              </td>
              {/* Cells for scores against opponents */}
              {tournament.couples.map((opponent, colIndex) => {
                if (rowIndex === colIndex) {
                  return (
                    <td
                      key={colIndex}
                      className="border border-gray-400 p-4 text-center"
                    >
                      -
                    </td>
                  );
                } else {
                  // Find the match between the couple and opponent
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

                    content = coupleScore.toString();

                    if (
                      coupleScore !== undefined &&
                      opponentScore !== undefined
                    ) {
                      if (coupleScore > opponentScore) {
                        isWinner = true;
                      } else if (coupleScore === opponentScore) {
                        // It's a tie
                        isWinner = false;
                      }
                    }
                  }

                  return (
                    <td
                      key={colIndex}
                      className={`border border-gray-400 p-4 text-center ${
                        isWinner ? "text-primary" : ""
                      }`}
                    >
                      {content}
                    </td>
                  );
                }
              })}
              {/* Last cell: Total Score */}
              <td
                className={`border border-gray-400 p-4 text-center font-bold ${
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
