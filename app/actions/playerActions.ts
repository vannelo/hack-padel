"use server";

import { revalidatePath } from "next/cache";

import { playerService } from "@/domain";
import { Player } from "@/domain/models/Player";

export async function createPlayer(playerData: Player): Promise<Player> {
  const newPlayer = await playerService.createPlayer(playerData);
  revalidatePath("/jugadores");
  return newPlayer;
}

export async function updatePlayer(
  playerId: string,
  playerData: Partial<Player>,
): Promise<void> {
  await playerService.updatePlayer(playerId, playerData);
  revalidatePath("/jugadores");
}

export async function deletePlayer(playerId: string): Promise<void> {
  await playerService.deletePlayer(playerId);
  revalidatePath("/jugadores");
}

export async function getAllPlayers(): Promise<Player[]> {
  return await playerService.getAllPlayers();
}
