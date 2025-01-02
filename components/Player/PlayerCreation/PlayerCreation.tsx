"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import PlayerCreationForm from "@/components/Forms/PlayerCreationForm/PlayerCreationForm";
import Plus from "@/components/Icons/PlusIcon/PlusIcon";
import Button from "@/components/UI/Button/Button";
import Modal from "@/components/UI/Modal/Modal";
import { useNotification } from "@/providers/NotificationContext";

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
        <Plus />
      </Button>
      <Modal
        title="Crear Jugador"
        open={isCreatingPlayer}
        onClose={() => setIsCreatingPlayer(false)}
      >
        <PlayerCreationForm onPlayerCreated={handlePlayerCreated} />
      </Modal>
    </>
  );
};

export default PlayerCreation;
