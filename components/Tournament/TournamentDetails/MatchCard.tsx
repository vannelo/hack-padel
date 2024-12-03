"use client";

import React, { useState, useCallback } from "react";
import { Match, MatchResults } from "@/domain/models/Match";
import CoupleScore from "./CoupleScore";
import Modal from "@/components/UI/Modal/Modal";
import Button from "@/components/UI/Button/Button";
import { updateMatchScore } from "@/app/actions/tournamentActions";

interface MatchCardProps {
  match: Match;
  isAdmin: boolean;
  isCurrentRound: boolean;
  matchResults: MatchResults;
  onScoreChange: (matchId: string, coupleNumber: 1 | 2, score: number) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isAdmin,
  isCurrentRound,
  matchResults,
  onScoreChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempScores, setTempScores] = useState<{
    couple1Score: number | null;
    couple2Score: number | null;
  }>({
    couple1Score: match.couple1Score || null,
    couple2Score: match.couple2Score || null,
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

  const handleSaveScores = useCallback(async () => {
    try {
      setSaving(true);
      if (tempScores.couple1Score !== null) {
        await updateMatchScore(match.id, 1, tempScores.couple1Score);
        onScoreChange(match.id, 1, tempScores.couple1Score);
      }
      if (tempScores.couple2Score !== null) {
        await updateMatchScore(match.id, 2, tempScores.couple2Score);
        onScoreChange(match.id, 2, tempScores.couple2Score);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving scores:", error);
      alert("Error al guardar los puntajes. Por favor, inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }, [match.id, tempScores, onScoreChange]);

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
              <Button onClick={handleSaveScores} isLoading={saving}>
                Guardar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MatchCard;
