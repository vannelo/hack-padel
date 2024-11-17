"use server";

import { Player } from "@/domain/models/Player";
import { PlayerService } from "@/domain/services/PlayerService";
import { revalidatePath } from "next/cache";

const playerService = new PlayerService();

export async function createPlayer(playerData: Player): Promise<Player> {
  const newPlayer = await playerService.createPlayer(playerData);
  revalidatePath("/jugadores");
  return newPlayer;
}

export async function getAllPlayers(): Promise<Player[]> {
  return await playerService.getAllPlayers();
}
