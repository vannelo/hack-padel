"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button/Button";
import PlayerForm from "../PlayerForm/PlayerForm";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
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
      <Button
        className="mt-4 rounded bg-primary px-4 py-2 font-black uppercase text-black"
        onClick={() => setIsCreatingPlayer(true)}
      >
        Crear Jugador
      </Button>
      <Dialog
        open={isCreatingPlayer}
        onClose={() => setIsCreatingPlayer(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crear Jugador</DialogTitle>
        <DialogContent>
          <PlayerForm onPlayerCreated={handlePlayerCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlayerCreation;
