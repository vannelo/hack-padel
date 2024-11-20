import React from "react";
import { Round } from "@/domain/models/Round";

interface CurrentRoundMatchesProps {
  round: Round;
}

const CurrentRoundMatches: React.FC<CurrentRoundMatchesProps> = ({ round }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {round.matches.map((match) => (
        <div key={match.id} className="rounded-lg bg-gray-700 p-4">
          <p className="mb-2 font-bold text-white">Cancha {match.court}</p>
          <p className="text-gray-300">
            {match.couple1.player1.name}/{match.couple1.player2.name} vs{" "}
            {match.couple2.player1.name}/{match.couple2.player2.name}
          </p>
          <p className="mt-2 font-bold text-white">
            {match.couple1Score} - {match.couple2Score}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CurrentRoundMatches;
