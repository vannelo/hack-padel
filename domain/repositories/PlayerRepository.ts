import { PrismaClient } from "@prisma/client";
import { Player } from "../models/Player";

const prisma = new PrismaClient();

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
