// @ts-nocheck

"use client";

import React from "react";
import { Match } from "@/domain/models/Match";
import { Tournament } from "@/domain/models/Tournament";

interface TournamentScoresProps {
  tournament: Tournament;
  currentMatches: Match[];
  startRound: () => void;
  isTournamentOver: boolean;
}

const TournamentScores: React.FC<TournamentScoresProps> = ({
  tournament,
  currentMatches,
  startRound,
  isTournamentOver,
}) => {
  // Ensure scores is defined
  const scores = tournament.scores || new Map<string, number>();

  // Calculate highest score
  const highestScore = Math.max(...Array.from(scores.values()), 0);

  // Identify leaders
  const leaders = Array.from(scores.entries())
    .filter(([_, score]) => score === highestScore)
    .map(([coupleId, _]) => coupleId);

  const getCoupleName = (couple: any) => {
    const player1Name = couple.player1?.name || "Sin Jugador 1";
    const player2Name = couple.player2?.name || "Sin Jugador 2";
    return `${player1Name} / ${player2Name}`;
  };

  return (
    <>
      <h2 className="text-3xl font-bold uppercase tracking-tighter text-primary">
        {tournament.name}
      </h2>
      {isTournamentOver ? (
        <div className="flex gap-8 p-4 text-xl font-bold uppercase text-white">
          <p>
            Ganadores:{" "}
            <span className="text-primary">
              {tournament.winners
                ?.map((winner) => getCoupleName(winner))
                .join(", ")}
            </span>
          </p>
        </div>
      ) : (
        <div className="flex gap-8 p-4 text-xl font-bold uppercase text-white">
          {leaders.length > 0 && (
            <p>
              Líderes:{" "}
              <span className="text-primary">
                {leaders
                  .map((leaderId) => {
                    const couple = tournament.couples.find(
                      (c) => c.id === leaderId,
                    );
                    return couple ? getCoupleName(couple) : "";
                  })
                  .join(", ")}
              </span>
            </p>
          )}
          <p>
            Ronda:{" "}
            <span className="text-primary">
              {tournament.currentMatchNumber}
            </span>
          </p>
        </div>
      )}
      <div className="flex w-full gap-4 border-gray-400 bg-black text-white">
        {!isTournamentOver && (
          <div className="w-1/6 border-r border-primary">
            {currentMatches.length > 0 && (
              <div className="p-4 text-center">
                <h3 className="mb-4 text-xl font-bold">Partidos actuales</h3>
                {currentMatches.map((match, index) => (
                  <div
                    key={index}
                    className="mb-4 border-b border-primary p-2 text-center font-bold"
                  >
                    {getCoupleName(match.couple1)}
                    <br />
                    vs
                    <br />
                    {getCoupleName(match.couple2)}
                  </div>
                ))}
                <button
                  className="w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
                  onClick={startRound}
                >
                  Terminar ronda
                </button>
              </div>
            )}
          </div>
        )}
        <div className={`${!isTournamentOver ? "w-5/6" : "w-full"}`}>
          <div className="my-4 uppercase">
            <table className="w-full table-auto border-collapse border border-gray-400 text-lg font-bold 2xl:text-xl">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-4 text-primary">
                    Parejas
                  </th>
                  {tournament.couples.map((couple, index) => (
                    <th key={index} className="border border-gray-400 p-4">
                      {getCoupleName(couple)}
                    </th>
                  ))}
                  <th className="border border-gray-400 p-4 text-primary">
                    Puntos
                  </th>
                </tr>
              </thead>
              <tbody className="text-lg 2xl:text-xl">
                {tournament.couples.map((couple, rowIndex) => (
                  <tr key={rowIndex}>
                    <td
                      className={`border border-gray-400 p-4 font-bold ${
                        leaders.includes(couple.id) ? "text-primary" : ""
                      }`}
                    >
                      {getCoupleName(couple)}
                    </td>
                    {tournament.couples.map((opponent, colIndex) => {
                      const match = tournament.matches.find(
                        (m) =>
                          (m.couple1.id === couple.id &&
                            m.couple2.id === opponent.id) ||
                          (m.couple1.id === opponent.id &&
                            m.couple2.id === couple.id),
                      );

                      const hasScores =
                        match &&
                        match.couple1Score !== undefined &&
                        match.couple2Score !== undefined;

                      let score = null;
                      let isWinner = false;

                      if (hasScores) {
                        const coupleScore =
                          couple.id === match.couple1.id
                            ? match.couple1Score
                            : match.couple2Score;
                        const opponentScore =
                          couple.id === match.couple1.id
                            ? match.couple2Score
                            : match.couple1Score;

                        score = coupleScore;

                        if (
                          coupleScore !== undefined &&
                          opponentScore !== undefined &&
                          coupleScore > opponentScore
                        ) {
                          isWinner = true;
                        } else if (coupleScore === opponentScore) {
                          // It's a tie
                          isWinner = false;
                        }
                      }

                      return (
                        <td
                          key={colIndex}
                          className={`border border-gray-400 p-4 text-center font-sans ${
                            isWinner ? "text-primary" : ""
                          }`}
                        >
                          {rowIndex === colIndex
                            ? "-"
                            : score !== null
                              ? score
                              : "-"}
                        </td>
                      );
                    })}

                    <td
                      className={`border border-gray-400 p-4 text-center font-sans font-bold ${
                        leaders.includes(couple.id) ? "text-primary" : ""
                      }`}
                    >
                      {scores.get(couple.id) || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentScores;
