import { PrismaClient } from "@prisma/client";
import { Player } from "../models/Player";

const prisma = new PrismaClient();

export class PlayerRepository {
  async createPlayer(player: Player): Promise<Player> {
    const createdPlayer = await prisma.player.create({
      data: {
        id: player.id,
        name: player.name,
        email: player.email,
        age: player.age,
        phone: player.phone,
        gender: player.gender!,
        level: player.level!,
      },
    });

    // @ts-ignore
    return createdPlayer;
  }

  async getPlayerById(id: string): Promise<Player | null> {
    const player = await prisma.player.findUnique({
      where: { id },
    });
    // @ts-ignore
    return player;
  }
}
