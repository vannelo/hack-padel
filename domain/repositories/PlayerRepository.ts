import { Player } from "../models/Player";
import { prisma } from "@/lib/prisma";

export class PlayerRepository {
  async createPlayer(playerData: Player): Promise<Player> {
    return prisma.player.create({
      data: playerData,
    });
  }

  async getPlayerById(id: string): Promise<Player | null> {
    return prisma.player.findUnique({
      where: { id },
    });
  }

  async getAllPlayers(): Promise<Player[]> {
    return prisma.player.findMany();
  }
}
