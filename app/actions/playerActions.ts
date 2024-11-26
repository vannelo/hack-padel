"use server";

import { playerService } from "@/domain";
import { Player } from "@/domain/models/Player";
import { revalidatePath } from "next/cache";

export async function createPlayer(playerData: Player): Promise<Player> {
  const newPlayer = await playerService.createPlayer(playerData);
  revalidatePath("/jugadores");
  return newPlayer;
}

export async function getAllPlayers(): Promise<Player[]> {
  return await playerService.getAllPlayers();
}

export async function deletePlayer(playerId: string): Promise<void> {
  await playerService.deletePlayer(playerId);
  revalidatePath("/jugadores");
}
