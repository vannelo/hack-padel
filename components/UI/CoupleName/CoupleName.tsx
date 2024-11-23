import { Couple } from "@/domain/models/Couple";

interface CoupleNameProps {
  couple: Couple;
}

const CoupleName: React.FC<CoupleNameProps> = ({ couple }) => {
  return (
    <div className="text-center">
      {couple.player1.name}
      <div className="mx-auto h-[1px] w-[16px] bg-primary" />{" "}
      {couple.player2.name}
    </div>
  );
};

export default CoupleName;
