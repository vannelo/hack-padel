import { Player } from "../models/Player";
import { PlayerRepository } from "../repositories/PlayerRepository";

export class PlayerService {
  private playerRepository = new PlayerRepository();

  async createPlayer(playerData: Player): Promise<Player> {
    return this.playerRepository.createPlayer(playerData);
  }

  async getPlayerById(id: string): Promise<Player | null> {
    return this.playerRepository.getPlayerById(id);
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playerRepository.getAllPlayers();
  }
}
