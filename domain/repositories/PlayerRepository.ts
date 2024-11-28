import { prisma } from "@/lib/prisma";
import { Player } from "../models/Player";

export class PlayerRepository {
  async createPlayer(playerData: Player): Promise<Player> {
    return prisma.player.create({
      data: playerData,
    });
  }

  async updatePlayer(id: string, playerData: Partial<Player>): Promise<Player> {
    return prisma.player.update({
      where: { id },
      data: playerData,
    });
  }

  async deletePlayer(id: string): Promise<void> {
    await prisma.player.delete({
      where: { id },
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
