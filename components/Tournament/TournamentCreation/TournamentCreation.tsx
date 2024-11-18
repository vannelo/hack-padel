"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/UI/Button/Button";
import TournamentForm from "../TournamentForm/TournamentForm";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useNotification } from "@/providers/NotificationContext";

const TournamentCreation: React.FC = () => {
  const [isCreatingTournament, setIsCreatingTournament] =
    useState<boolean>(false);
  const { notify } = useNotification();
  const router = useRouter();

  const handleTournamentCreated = () => {
    setIsCreatingTournament(false);
    notify({
      message: "Torneo creado correctamente",
      severity: "success",
    });
    router.refresh();
  };

  return (
    <>
      <Button
        className="mt-4 rounded bg-primary px-4 py-2 font-black uppercase text-black"
        onClick={() => setIsCreatingTournament(true)}
      >
        Crear Torneo
      </Button>
      <Dialog
        open={isCreatingTournament}
        onClose={() => setIsCreatingTournament(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crear Torneo</DialogTitle>
        <DialogContent>
          <TournamentForm onTournamentCreated={handleTournamentCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TournamentCreation;
