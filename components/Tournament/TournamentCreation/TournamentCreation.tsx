"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
