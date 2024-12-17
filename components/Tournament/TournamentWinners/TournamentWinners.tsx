"use client";

import React from "react";
import Confetti from "react-confetti";

interface TournamentWinnersProps {
  winner: any;
}

const TournamentWinners: React.FC<TournamentWinnersProps> = ({ winner }) => {
  return (
    <div className="relative rounded-full border border-white p-6 text-center">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={300}
      />
      <h2 className="text-2xl font-bold text-white">Ganadores</h2>
      <h3 className="text-4xl font-bold text-white">
        <span className="text-primary">
          {winner?.player1.name} / {winner?.player2.name}
        </span>
      </h3>
      <p className="text-white">¡Felicidades!</p>
    </div>
  );
};

export default TournamentWinners;
