"use server";

import { tournamentService } from "@/domain";
import { Couple, Tournament } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTournament(tournamentData: {
  name: string;
  couples: Couple[];
  numberOfCourts: number;
}): Promise<Tournament> {
  const newTournament = await tournamentService.createTournament(
    tournamentData.name,
    tournamentData.couples,
    tournamentData.numberOfCourts,
  );
  revalidatePath("/torneos");
  return newTournament;
}

export async function getTournamentById(
  tournamentId: string,
): Promise<Tournament | null> {
  return await tournamentService.getTournamentById(tournamentId);
}

export async function getAllTournaments(): Promise<Tournament[]> {
  return await tournamentService.getAllTournaments();
}

export async function updateTournament(updatedTournament: any): Promise<void> {
  try {
    // Convert Map to Object for the scores field
    const scoresObject =
      updatedTournament.scores instanceof Map
        ? Object.fromEntries(updatedTournament.scores)
        : updatedTournament.scores;

    const payload = {
      ...updatedTournament,
      scores: scoresObject,
      winners: updatedTournament.winners?.map((winner: any) => ({
        id: winner.id,
      })),
    };

    // Persist the updated tournament via the service
    await tournamentService.updateTournament(payload);

    // Optionally revalidate the relevant path if needed
    revalidatePath(`/torneos/${updatedTournament.id}`);
  } catch (error) {
    console.error("Error in updateTournament action:", error);
    throw error;
  }
}
