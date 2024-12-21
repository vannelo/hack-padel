"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";

import { tournamentService } from "@/domain";
import { Couple } from "@/domain/models/Couple";
import { Tournament } from "@/domain/models/Tournament";

export async function createTournament(
  name: string,
  courts: number,
  couples: Couple[],
): Promise<Tournament> {
  const newTournament = await tournamentService.createTournament(
    name,
    courts,
    couples,
  );
  revalidatePath("/torneos");
  return newTournament;
}

export async function deleteTournament(tournamentId: string): Promise<void> {
  await tournamentService.deleteTournament(tournamentId);
  revalidatePath("/torneos");
}

export const getAllTournaments = cache(async (): Promise<Tournament[]> => {
  const tournaments = await tournamentService.getAllTournaments();
  return tournaments;
});

export const getTournamentById = cache(
  async (id: string): Promise<Tournament | null> => {
    return await tournamentService.getTournamentById(id);
  },
);

export const updateMatchResults = cache(
  async (
    tournamentId: string,
    roundId: string,
    matchResults: {
      [key: string]: { couple1Score: number; couple2Score: number };
    },
  ): Promise<void> => {
    await tournamentService.updateMatchResults(
      tournamentId,
      roundId,
      matchResults,
    );
    revalidatePath(`/torneos/${tournamentId}`);
  },
);

export const endRound = cache(
  async (tournamentId: string, roundId: string): Promise<void> => {
    await tournamentService.endRound(tournamentId, roundId);
    revalidatePath(`/torneos/${tournamentId}`);
  },
);

export async function updateMatchScore(
  matchId: string,
  coupleNumber: number,
  score: number,
): Promise<void> {
  await tournamentService.updateMatchScore(matchId, coupleNumber, score);
}

export const markTournamentFinished = cache(async (tournamentId: string) => {
  const updatedTournament =
    await tournamentService.finishTournament(tournamentId);
  revalidatePath(`/torneos/${tournamentId}`);
  return updatedTournament;
});

export const updateTournamentProgress = cache(
  async (tournamentId: string, currentRound: number): Promise<void> => {
    await tournamentService.updateTournamentProgress(
      tournamentId,
      currentRound,
    );
    revalidatePath(`/torneos/${tournamentId}`);
  },
);
