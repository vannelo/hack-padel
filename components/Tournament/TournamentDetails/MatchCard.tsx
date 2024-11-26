import React from "react";
import { Match, MatchResults } from "@/domain/models/Match";
import CoupleName from "@/components/UI/CoupleName/CoupleName";

interface MatchCardProps {
  match: Match;
  isAdmin: boolean;
  matchResults: MatchResults;
  onScoreChange: (matchId: string, coupleNumber: 1 | 2, score: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isAdmin,
  matchResults,
  onScoreChange,
}) => {
  return (
    <div className="rounded-3xl border border-zinc-600 p-8 text-center">
      <h3 className="mb-4 border border-black border-b-zinc-600 p-2 text-xl font-bold text-primary">
        Cancha {match.court}
      </h3>
      <div className="flex items-center justify-center space-x-4 text-white">
        <CoupleScore
          couple={match.couple1}
          coupleNumber={1}
          matchId={match.id}
          isAdmin={isAdmin}
          matchResults={matchResults}
          onScoreChange={onScoreChange}
        />
        <div className="font-bold text-primary">
          <span className="text-primary">vs</span>
        </div>
        <CoupleScore
          couple={match.couple2}
          coupleNumber={2}
          matchId={match.id}
          isAdmin={isAdmin}
          matchResults={matchResults}
          onScoreChange={onScoreChange}
        />
      </div>
    </div>
  );
};

interface CoupleScoreProps {
  couple: any;
  coupleNumber: 1 | 2;
  matchId: string;
  isAdmin: boolean;
  matchResults: MatchResults;
  onScoreChange: (matchId: string, coupleNumber: 1 | 2, score: number) => void;
}

const CoupleScore: React.FC<CoupleScoreProps> = ({
  couple,
  coupleNumber,
  matchId,
  isAdmin,
  matchResults,
  onScoreChange,
}) => {
  return (
    <div>
      <CoupleName couple={couple} />
      {isAdmin && (
        <>
          <p className="mt-4 text-[12px] font-bold text-white">Puntos</p>
          <input
            type="number"
            min="0"
            max={10}
            placeholder="0"
            value={
              matchResults[matchId]?.[`couple${coupleNumber}Score`] !==
              undefined
                ? matchResults[matchId][`couple${coupleNumber}Score`]
                : ""
            }
            onChange={(e) =>
              onScoreChange(matchId, coupleNumber, parseInt(e.target.value, 10))
            }
            className="rounded bg-zinc-600 p-2 text-center text-primary"
          />
        </>
      )}
    </div>
  );
};

export default MatchCard;
