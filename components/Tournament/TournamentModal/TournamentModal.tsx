"use client";

import Button from "@/components/UI/Button/Button";
import { Match } from "@/domain/models/Match";

interface TournamentModalProps {
  currentMatches: Match[];
  matchResults: Map<string, { couple1Score: number; couple2Score: number }>;
  setMatchResults: React.Dispatch<
    React.SetStateAction<
      Map<string, { couple1Score: number; couple2Score: number }>
    >
  >;
  endRound: () => void;
  isSettingScores: boolean;
}

const TournamentModal: React.FC<TournamentModalProps> = ({
  currentMatches,
  matchResults,
  setMatchResults,
  endRound,
  isSettingScores,
}) => {
  const getCoupleName = (couple: any) => {
    const player1Name = couple.player1?.name || "Sin Jugador 1";
    const player2Name = couple.player2?.name || "Sin Jugador 2";
    return `${player1Name} / ${player2Name}`;
  };

  return (
    <div className="text-black">
      {currentMatches.map((match, index) => (
        <div
          className="flex items-center justify-center border-b py-4 text-center font-bold"
          key={index}
        >
          <div className="w-5/12">
            <p className="mb-2">{getCoupleName(match.couple1)}</p>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0"
              className="w-[80px] border p-2 text-center text-black"
              onChange={(e) => {
                const key = `${match.couple1.id}-${match.couple2.id}`;
                const scores = matchResults.get(key) || {
                  couple1Score: 0,
                  couple2Score: 0,
                };
                scores.couple1Score = parseInt(e.target.value);
                setMatchResults(new Map(matchResults.set(key, scores)));
              }}
              required
            />
          </div>
          <div className="w-2/12 text-center">
            <span className="text-xl font-bold">vs</span>
          </div>
          <div className="w-5/12">
            <p className="mb-2">{getCoupleName(match.couple2)}</p>
            <input
              type="number"
              min="0"
              max="10"
              placeholder="0"
              className="w-[80px] border p-2 text-center text-black"
              onChange={(e) => {
                const key = `${match.couple1.id}-${match.couple2.id}`;
                const scores = matchResults.get(key) || {
                  couple1Score: 0,
                  couple2Score: 0,
                };
                scores.couple2Score = parseInt(e.target.value);
                setMatchResults(new Map(matchResults.set(key, scores)));
              }}
              required
            />
          </div>
        </div>
      ))}
      <div className="mt-8">
        <Button
          className="w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
          onClick={endRound}
          isLoading={isSettingScores}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default TournamentModal;
