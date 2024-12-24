"use server";

import { revalidatePath } from "next/cache";

import { tournamentService } from "@/domain";
import { Couple } from "@/domain/models/Couple";
import { Tournament } from "@/domain/models/Tournament";
import { appRoutes } from "@/utils/constants";

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
  revalidatePath(appRoutes.admin.tournaments);
  return newTournament;
}

export async function deleteTournament(tournamentId: string): Promise<void> {
  await tournamentService.deleteTournament(tournamentId);
  revalidatePath(appRoutes.admin.tournaments);
}

export async function getAllTournaments(): Promise<Tournament[]> {
  const tournaments = await tournamentService.getAllTournaments();
  return tournaments;
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
  await tournamentService.updateMatchResults(
    tournamentId,
    roundId,
    matchResults,
  );
  revalidatePath(`${appRoutes.admin.tournaments}/${tournamentId}`);
}

export async function endRound(
  tournamentId: string,
  roundId: string,
): Promise<void> {
  await tournamentService.endRound(tournamentId, roundId);
  revalidatePath(`${appRoutes.admin.tournaments}/${tournamentId}`);
}

export async function updateMatchScore(
  matchId: string,
  coupleNumber: number,
  score: number,
): Promise<void> {
  await tournamentService.updateMatchScore(matchId, coupleNumber, score);
}

export async function updateTournamentProgress(
  tournamentId: string,
  currentRound: number,
): Promise<void> {
  await tournamentService.updateTournamentProgress(tournamentId, currentRound);
  revalidatePath(`${appRoutes.admin.tournaments}/${tournamentId}`);
}
