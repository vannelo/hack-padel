"use client";

import React, { useState } from "react";

import Button from "@/components/UI/Button/Button";
import Modal from "@/components/UI/Modal/Modal";
import { Match, MatchResults } from "@/domain/models/Match";

import CoupleScore from "./CoupleScore";

interface MatchCardProps {
  match: Match;
  isAdmin: boolean;
  isCurrentRound: boolean;
  matchResults: MatchResults;
  onScoreChange: (matchId: string, coupleNumber: 1 | 2, score: number) => void;
  onLoadingStateChange: (state: boolean) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isAdmin,
  isCurrentRound,
  matchResults,
  onScoreChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempScores, setTempScores] = useState<{
    couple1Score: number | null;
    couple2Score: number | null;
  }>({
    couple1Score:
      matchResults[match.id]?.couple1Score ?? match.couple1Score ?? null,
    couple2Score:
      matchResults[match.id]?.couple2Score ?? match.couple2Score ?? null,
  });

  const openModal = () => {
    setTempScores({
      couple1Score:
        matchResults[match.id]?.couple1Score ?? match.couple1Score ?? null,
      couple2Score:
        matchResults[match.id]?.couple2Score ?? match.couple2Score ?? null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveScores = async () => {
    if (tempScores.couple1Score !== null) {
      await onScoreChange(match.id, 1, tempScores.couple1Score);
    }
    if (tempScores.couple2Score !== null) {
      await onScoreChange(match.id, 2, tempScores.couple2Score);
    }
    closeModal();
  };

  return (
    <div className="rounded-lg border border-zinc-600 bg-zinc-800 p-4 text-center">
      <h3 className="mb-4 text-xl font-bold">Cancha {match.court}</h3>
      <div className="mb-8 flex items-center justify-center space-x-4 text-white">
        <CoupleScore
          couple={match.couple1}
          coupleNumber={1}
          matchId={match.id}
          isAdmin={false}
          matchResults={matchResults}
          storedScore={match.couple1Score}
          onScoreChange={() => {}}
        />
        <div className="font-bold text-primary">
          <span className="text-primary">vs</span>
        </div>
        <CoupleScore
          couple={match.couple2}
          coupleNumber={2}
          matchId={match.id}
          isAdmin={false}
          matchResults={matchResults}
          storedScore={match.couple2Score}
          onScoreChange={() => {}}
        />
      </div>
      {isAdmin && isCurrentRound && (
        <button
          className="rounded-3xl border border-zinc-600 bg-primary px-6 py-2 text-sm font-bold text-black"
          onClick={openModal}
        >
          Añadir Puntos
        </button>
      )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={closeModal}
          title={`Añadir Puntos: ${match.couple1.player1.name} / ${match.couple1.player2.name} vs ${match.couple2.player1.name} / ${match.couple2.player2.name}`}
        >
          <div>
            <p className="text-sm">Ingrese los puntos para cada pareja:</p>
            <div className="my-4">
              <div className="mb-4">
                <strong>
                  {match.couple1.player1.name} / {match.couple1.player2.name}
                </strong>
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  value={tempScores.couple1Score ?? ""}
                  onChange={(e) =>
                    setTempScores((prev) => ({
                      ...prev,
                      couple1Score: parseInt(e.target.value, 10),
                    }))
                  }
                  className="ml-4 rounded bg-zinc-600 p-2 text-center text-primary"
                />
              </div>
              <div>
                <strong>
                  {match.couple2.player1.name} / {match.couple2.player2.name}
                </strong>
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  value={tempScores.couple2Score ?? ""}
                  onChange={(e) =>
                    setTempScores((prev) => ({
                      ...prev,
                      couple2Score: parseInt(e.target.value, 10),
                    }))
                  }
                  className="ml-4 rounded bg-zinc-600 p-2 text-center text-primary"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveScores}>Guardar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MatchCard;
