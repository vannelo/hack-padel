import { Player } from "../models/Player";
import { PlayerRepository } from "../repositories/PlayerRepository";

export class PlayerService {
  private playerRepository = new PlayerRepository();

  async createPlayer(playerData: Player): Promise<Player> {
    return this.playerRepository.createPlayer(playerData);
  }

  async updatePlayer(id: string, playerData: Partial<Player>): Promise<Player> {
    return this.playerRepository.updatePlayer(id, playerData);
  }

  async deletePlayer(id: string): Promise<void> {
    await this.playerRepository.deletePlayer(id);
  }

  async getPlayerById(id: string): Promise<Player | null> {
    return this.playerRepository.getPlayerById(id);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.getAllPlayers();
  }
}
