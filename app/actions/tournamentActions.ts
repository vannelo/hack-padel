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

export async function getAllTournaments(): Promise<Tournament[]> {
  return await tournamentService.getAllTournaments();
}
