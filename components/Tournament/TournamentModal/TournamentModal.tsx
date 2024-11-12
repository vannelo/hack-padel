"use client";

import { Match } from "@/domain/models/Match";

interface TournamentModalProps {
  showScoreInputs: boolean;
  currentMatches: Match[];
  matchResults: Map<string, { couple1Score: number; couple2Score: number }>;
  setMatchResults: React.Dispatch<
    React.SetStateAction<
      Map<string, { couple1Score: number; couple2Score: number }>
    >
  >;
  endRound: () => void;
}

const TournamentModal: React.FC<TournamentModalProps> = ({
  showScoreInputs,
  currentMatches,
  matchResults,
  setMatchResults,
  endRound,
}) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full w-full bg-black bg-opacity-50 ${
        showScoreInputs ? "block" : "hidden"
      }`}
    >
      <div className="flex h-full items-center justify-center">
        {showScoreInputs && (
          <div className="mb-4 rounded bg-white p-4 text-black">
            <div className="text-center">
              <h3 className="text-xl font-bold">AGREGAR RESULTADOS</h3>
              <p className="mb-4 text-sm">
                Ingresa los resultados de los partidos
              </p>
            </div>
            {currentMatches.map((match, index) => (
              <div key={index} className="mb-4">
                <h4 className="mb-2 text-lg font-bold">
                  {match.couple1.name} vs {match.couple2.name}
                </h4>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    placeholder="Puntos"
                    className="border p-2 text-black"
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
                  <span className="text-xl font-bold">vs</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Puntos"
                    className="border p-2 text-black"
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
              <button
                className="w-full rounded bg-primary px-4 py-2 font-bold uppercase text-black"
                onClick={endRound}
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentModal;
