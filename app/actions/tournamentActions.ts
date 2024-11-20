"use server";

import { tournamentService } from "@/domain";
import { Tournament } from "@/domain/models/Tournament";
import { Couple } from "@/domain/models/Couple";
import { revalidatePath } from "next/cache";

export async function createTournament(
  name: string,
  courts: number,
  couples: Couple[],
): Promise<Tournament> {
  console.log("Creating tournament:", { name, courts, couples });
  const newTournament = await tournamentService.createTournament(
    name,
    courts,
    couples,
  );
  revalidatePath("/torneos");
  return newTournament;
}

export async function getAllTournaments(): Promise<Tournament[]> {
  return await tournamentService.getAllTournaments();
}

export async function getTournamentById(
  id: string,
): Promise<Tournament | null> {
  return await tournamentService.getTournamentById(id);
}

export async function updateMatchResults(
  tournamentId: string,
  roundId: string,
  matchResults: {
    [key: string]: { couple1Score: number; couple2Score: number };
  },
): Promise<void> {
  console.log("Updating match results:", {
    tournamentId,
    roundId,
    matchResults,
  });
  await tournamentService.updateMatchResults(
    tournamentId,
    roundId,
    matchResults,
  );
  revalidatePath(`/torneos/${tournamentId}`);
}

export async function endRound(
  tournamentId: string,
  roundId: string,
): Promise<void> {
  console.log("Ending round:", { tournamentId, roundId });
  await tournamentService.endRound(tournamentId, roundId);
  revalidatePath(`/torneos/${tournamentId}`);
}
