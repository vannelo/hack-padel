"use client";

import { Match } from "@/domain/models/Match";
import { Tournament } from "@/domain/models/Tournament";

interface TournamentProps {
  tournament: Tournament;
  currentMatches: Match[];
  startRound: () => void;
}

const TournamentTable: React.FC<TournamentProps> = ({
  tournament,
  currentMatches,
  startRound,
}) => {
  return (
    <>
      <h2 className="text-3xl font-bold uppercase tracking-tighter text-primary">
        {tournament.name}
      </h2>
      {/* CURRENT LEADER AND MATCH NUMBER */}
      <div className="flex gap-8 p-4 text-xl font-bold uppercase text-white">
        {tournament.currentLeader && (
          <p>
            Líderes:{" "}
            <span className="text-primary">
              {tournament.currentLeader?.name}
            </span>
          </p>
        )}
        <p>
          Ronda:{" "}
          <span className="text-primary">{tournament.currentMatchNumber}</span>
        </p>
      </div>
      {/* TOURNAMENT CONTAINER */}
      <div className="flex w-full gap-4 border-gray-400 bg-black text-white">
        <div className="w-1/6 border-r border-primary">
          {/* MATCHES */}
          {currentMatches.length > 0 && (
            <div className="p-4 text-center">
              <h3 className="mb-4 text-xl font-bold">Partidos actuales</h3>
              {currentMatches.map((match, index) => (
                <div
                  key={index}
                  className="mb-4 border-b border-primary p-2 text-center font-bold"
                >
                  {match.couple1.name}
                  <br></br>
                  vs
                  <br></br>
                  {match.couple2.name}
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
        <div className="w-5/6">
          {/* TABLE */}
          <div className="my-4 uppercase">
            <table className="w-full table-auto border-collapse border border-gray-400 text-lg font-bold 2xl:text-xl">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-4 text-primary">
                    Parejas
                  </th>
                  {tournament.couples.map((couple, index) => (
                    <th key={index} className="border border-gray-400">
                      {couple.name}
                    </th>
                  ))}
                  <th className="border border-gray-400 text-primary">
                    Puntos
                  </th>
                </tr>
              </thead>
              <tbody className="text-lg 2xl:text-xl">
                {tournament.couples.map((couple, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-400 p-4 font-bold">
                      {couple.name}
                    </td>
                    {tournament.couples.map((opponent, colIndex) => {
                      const match = tournament.matches.find(
                        (m) =>
                          (m.couple1.id === couple.id &&
                            m.couple2.id === opponent.id) ||
                          (m.couple1.id === opponent.id &&
                            m.couple2.id === couple.id),
                      );

                      const score =
                        match &&
                        match.couple1Score !== undefined &&
                        match.couple2Score !== undefined
                          ? couple.id === match.couple1.id
                            ? match.couple1Score
                            : match.couple2Score
                          : null;

                      return (
                        <td
                          key={colIndex}
                          className="border border-gray-400 text-center font-sans"
                        >
                          {rowIndex === colIndex
                            ? "-"
                            : score !== null
                              ? score
                              : "-"}
                        </td>
                      );
                    })}
                    <td className="border border-gray-400 text-center font-sans font-bold">
                      {tournament.scores.get(couple.id)}
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

export default TournamentTable;
