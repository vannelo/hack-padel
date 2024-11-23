"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button/Button";
import PlayerForm from "../PlayerForm/PlayerForm";
import { useNotification } from "@/providers/NotificationContext";
import Modal from "@/components/UI/Modal/Modal";

const PlayerCreation: React.FC = () => {
  const [isCreatingPlayer, setIsCreatingPlayer] = useState<boolean>(false);
  const { notify } = useNotification();
  const router = useRouter();

  const handlePlayerCreated = () => {
    setIsCreatingPlayer(false);
    notify({
      message: "Jugador creado correctamente",
      severity: "success",
    });
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setIsCreatingPlayer(true)}>
        Crear Jugador
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-black"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 00-1 1v6H3a1 1 0 100 2h6v6a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </Button>
      <Modal
        title="Crear Jugador"
        open={isCreatingPlayer}
        onClose={() => setIsCreatingPlayer(false)}
      >
        <PlayerForm onPlayerCreated={handlePlayerCreated} />
      </Modal>
    </>
  );
};

export default PlayerCreation;
