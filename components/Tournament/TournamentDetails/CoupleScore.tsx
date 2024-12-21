import { updateMatchScore } from "@/app/actions/tournamentActions";
import CoupleName from "@/components/UI/CoupleName/CoupleName";
import { MatchResults } from "@/domain/models/Match";

interface CoupleScoreProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  couple: any;
  coupleNumber: 1 | 2;
  matchId: string;
  isAdmin: boolean;
  matchResults: MatchResults;
  storedScore: number | null;
  onScoreChange: (matchId: string, coupleNumber: 1 | 2, score: number) => void;
}

const CoupleScore: React.FC<CoupleScoreProps> = ({
  couple,
  coupleNumber,
  matchId,
  isAdmin,
  matchResults,
  storedScore,
  onScoreChange,
}) => {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value, 10);
    if (isNaN(newScore)) return;

    onScoreChange(matchId, coupleNumber, newScore);

    // Persist the score to the database
    await updateMatchScore(matchId, coupleNumber, newScore);
  };

  const score =
    storedScore !== null && storedScore !== undefined
      ? storedScore
      : (matchResults[matchId]?.[`couple${coupleNumber}Score`] ?? "-");

  return (
    <div>
      <CoupleName couple={couple} />
      <p className="mt-4 text-[12px] font-bold text-white">Puntos</p>
      {isAdmin ? (
        <input
          type="number"
          min="0"
          max="10"
          placeholder="0"
          value={
            matchResults[matchId]?.[`couple${coupleNumber}Score`] !== undefined
              ? matchResults[matchId][`couple${coupleNumber}Score`]
              : ""
          }
          onChange={handleChange}
          className="rounded bg-zinc-600 p-2 text-center text-primary"
        />
      ) : (
        <span className="mt-2 block text-lg font-bold text-primary">
          {score}
        </span>
      )}
    </div>
  );
};

export default CoupleScore;
