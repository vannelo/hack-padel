// @ts-nocheck

import { Tournament } from "../models/Tournament";
import { Couple } from "../models/Couple";
import { Round } from "../models/Round";
import { prisma } from "@/lib/prisma";

export class TournamentRepository {
  async createTournament(
    name: string,
    courts: number,
    couples: Couple[],
    rounds: Round[],
  ): Promise<Tournament> {
    return prisma.$transaction(
      async (prisma) => {
        // First, create the tournament
        const tournament = await prisma.tournament.create({
          data: {
            name,
            courts,
            isFinished: false,
            currentRound: 1,
          },
        });

        // Create couples and store the mapping of temporary IDs to database IDs
        const coupleIdMap = new Map<string, string>();
        for (const couple of couples) {
          const createdCouple = await prisma.couple.create({
            data: {
              tournament: { connect: { id: tournament.id } },
              player1: { connect: { id: couple.player1Id } },
              player2: { connect: { id: couple.player2Id } },
            },
          });
          coupleIdMap.set(couple.id, createdCouple.id);
        }

        // Create rounds and matches
        for (const round of rounds) {
          const createdRound = await prisma.round.create({
            data: {
              tournament: { connect: { id: tournament.id } },
              isActive: round.isActive,
              roundNumber: round.roundNumber, // Save the round number
            },
          });

          // Create matches for this round
          await prisma.match.createMany({
            data: round.matches.map((match) => ({
              roundId: createdRound.id,
              couple1Id: coupleIdMap.get(match.couple1Id)!,
              couple2Id: coupleIdMap.get(match.couple2Id)!,
              couple1Score: null,
              couple2Score: null,
              court: match.court,
            })),
          });
        }

        // Finally, fetch the complete tournament data
        return this.getTournamentById(tournament.id);
      },
      {
        timeout: 10000, // Increase timeout to 10 seconds
        maxWait: 15000, // Maximum time to wait for transaction to start
      },
    );
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    return prisma.tournament.findUnique({
      where: { id },
      include: {
        couples: {
          include: {
            player1: true,
            player2: true,
          },
        },
        rounds: {
          orderBy: {
            roundNumber: "asc", // Order rounds by roundNumber
          },
          include: {
            matches: {
              include: {
                couple1: {
                  include: {
                    player1: true,
                    player2: true,
                  },
                },
                couple2: {
                  include: {
                    player1: true,
                    player2: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return prisma.tournament.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        couples: {
          include: {
            player1: true,
            player2: true,
          },
        },
        rounds: {
          include: {
            matches: {
              include: {
                couple1: {
                  include: {
                    player1: true,
                    player2: true,
                  },
                },
                couple2: {
                  include: {
                    player1: true,
                    player2: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateMatchResults(
    tournamentId: string,
    roundId: string,
    matchResults: {
      [key: string]: { couple1Score: number; couple2Score: number };
    },
  ): Promise<void> {
    await prisma.$transaction(async (prisma) => {
      for (const [matchId, scores] of Object.entries(matchResults)) {
        await prisma.match.update({
          where: { id: matchId },
          data: {
            couple1Score: scores.couple1Score,
            couple2Score: scores.couple2Score,
          },
        });
      }
    });
  }

  async updateRoundStatus(roundId: string, isActive: boolean): Promise<void> {
    await prisma.round.update({
      where: { id: roundId },
      data: { isActive },
    });
  }

  async updateTournamentStatus(
    tournamentId: string,
    isFinished: boolean,
  ): Promise<void> {
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { isFinished },
    });
  }

  async updateTournamentProgress(
    tournamentId: string,
    currentRound: number,
  ): Promise<void> {
    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { currentRound },
    });
  }

  async deleteTournament(id: string): Promise<void> {
    await prisma.tournament.delete({
      where: { id },
    });
  }

  async updateMatch(
    matchId: string,
    updateData: { couple1Score?: number; couple2Score?: number },
  ): Promise<void> {
    await prisma.match.update({
      where: { id: matchId },
      data: updateData,
    });
  }
}
