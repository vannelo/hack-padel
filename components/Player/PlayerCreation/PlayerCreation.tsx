"use client";

import { useState } from "react";
import Button from "@/components/UI/Button/Button";
import PlayerForm from "../PlayerForm/PlayerForm";

const PlayerCreation: React.FC = () => {
  const [isCreatingPlayer, setIsCreatingPlayer] = useState<boolean>(false);

  const handlePlayerCreated = () => {
    setIsCreatingPlayer(false);
  };

  return (
    <>
      {!isCreatingPlayer && (
        <Button
          className="mt-4 rounded bg-primary px-4 py-2 font-black uppercase text-black"
          onClick={() => setIsCreatingPlayer(true)}
        >
          Crear Jugador
        </Button>
      )}
      {isCreatingPlayer && <PlayerForm onPlayerCreated={handlePlayerCreated} />}
    </>
  );
};

export default PlayerCreation;
