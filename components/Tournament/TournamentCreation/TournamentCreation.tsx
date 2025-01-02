"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import PlusIcon from "@/components/Icons/PlusIcon/PlusIcon";
import Button from "@/components/UI/Button/Button";
import Modal from "@/components/UI/Modal/Modal";
import { useNotification } from "@/providers/NotificationContext";

import TournamentForm from "../TournamentForm/TournamentForm";

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
      <Button onClick={() => setIsCreatingTournament(true)}>
        Crear Torneo
        <PlusIcon />
      </Button>
      <Modal
        title="Crear Torneo"
        open={isCreatingTournament}
        onClose={() => setIsCreatingTournament(false)}
      >
        <TournamentForm onTournamentCreated={handleTournamentCreated} />
      </Modal>
    </>
  );
};

export default TournamentCreation;
