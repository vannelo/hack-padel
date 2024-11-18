import {
  Couple,
  Match,
  PrismaClient,
  Tournament as PrismaTournament,
} from "@prisma/client";
import { CreateTournamentInput } from "../models/Tournament";

const prisma = new PrismaClient();

export interface Tournament extends PrismaTournament {
  couples: Couple[];
  matches: Match[];
  scores: Map<string, number>;
  currentLeader?: Couple;
  winners: Couple[];
}

export class TournamentRepository {
  async createTournament(
    tournament: CreateTournamentInput,
  ): Promise<Tournament> {
    return await prisma.$transaction(async (tx) => {
      // Step 1: Create the Tournament
      const createdTournament = await tx.tournament.create({
        data: {
          id: tournament.id,
          name: tournament.name,
          currentMatchNumber: tournament.currentMatchNumber,
          numberOfCourts: tournament.numberOfCourts,
        },
      });

      // Step 2: Create Couples in bulk
      const coupleData = tournament.couples.map((couple) => ({
        id: couple.id,
        player1Id: couple.player1Id!,
        player2Id: couple.player2Id!,
        tournamentId: createdTournament.id,
      }));

      await tx.couple.createMany({
        data: coupleData,
      });

      // Step 3: Create Matches in bulk
      const matchData = tournament.matches.map((match: any) => ({
        id: match.id,
        couple1Id: match.couple1.id,
        couple2Id: match.couple2.id,
        couple1Score: match.couple1Score,
        couple2Score: match.couple2Score,
        tournamentId: createdTournament.id,
      }));

      await tx.match.createMany({
        data: matchData,
      });

      // Fetch and return the complete tournament
      const completeTournament = await tx.tournament.findUnique({
        where: { id: createdTournament.id },
        include: {
          couples: { include: { player1: true, player2: true } },
          matches: true,
          currentLeader: true,
          winners: true,
        },
      });

      if (!completeTournament) {
        throw new Error("Failed to fetch the created tournament");
      }

      return this.mapPrismaTournamentToDomain(completeTournament);
    });
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    const prismaTournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        couples: {
          include: {
            player1: true,
            player2: true,
          },
        },
        matches: true,
        currentLeader: {
          include: {
            player1: true,
            player2: true,
          },
        },
        winners: {
          include: {
            player1: true,
            player2: true,
          },
        },
      },
    });

    if (!prismaTournament) return null;

    return this.mapPrismaTournamentToDomain(prismaTournament);
  }

  async getAllTournaments(): Promise<Tournament[]> {
    const prismaTournaments = await prisma.tournament.findMany({
      include: {
        couples: {
          include: {
            player1: true,
            player2: true,
          },
        },
        matches: true,
        currentLeader: {
          include: {
            player1: true,
            player2: true,
          },
        },
        winners: {
          include: {
            player1: true,
            player2: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return prismaTournaments.map((t) => this.mapPrismaTournamentToDomain(t));
  }

  async updateTournament(tournament: Tournament): Promise<Tournament> {
    const scoresObject =
      tournament.scores instanceof Map
        ? Object.fromEntries(tournament.scores)
        : tournament.scores; // Ensure scores is an object for Prisma

    const updatedTournament = await prisma.tournament.update({
      where: { id: tournament.id },
      data: {
        currentLeaderId: tournament.currentLeader?.id,
        currentMatchNumber: tournament.currentMatchNumber,
        numberOfCourts: tournament.numberOfCourts,
        scoresJson: scoresObject, // Persist scores as JSON
        matches: {
          upsert: tournament.matches.map((match) => ({
            where: { id: match.id },
            create: {
              id: match.id,
              couple1Id: match.couple1Id,
              couple2Id: match.couple2Id,
              couple1Score: match.couple1Score,
              couple2Score: match.couple2Score,
            },
            update: {
              couple1Score: match.couple1Score,
              couple2Score: match.couple2Score,
            },
          })),
        },
        winners: {
          set: tournament.winners?.map((winner) => ({ id: winner.id })) || [],
        },
      },
      include: {
        couples: {
          include: {
            player1: true,
            player2: true,
          },
        },
        matches: true,
        currentLeader: true,
        winners: {
          include: {
            player1: true,
            player2: true,
          },
        },
      },
    });

    return this.mapPrismaTournamentToDomain(updatedTournament);
  }

  private mapPrismaTournamentToDomain(prismaTournament: any): Tournament {
    const couples: Couple[] = prismaTournament.couples.map((c: any) => ({
      id: c.id,
      tournamentId: c.tournamentId,
      player1: c.player1,
      player2: c.player2,
    }));

    const coupleMap = new Map<string, Couple>();
    couples.forEach((c) => coupleMap.set(c.id, c));

    const matches: Match[] = prismaTournament.matches.map((m: any) => ({
      id: m.id,
      tournamentId: m.tournamentId,
      couple1: coupleMap.get(m.couple1Id)!,
      couple2: coupleMap.get(m.couple2Id)!,
      couple1Score: m.couple1Score ?? undefined,
      couple2Score: m.couple2Score ?? undefined,
    }));

    const scores = prismaTournament.scoresJson
      ? new Map<string, number>(
          Object.entries(
            prismaTournament.scoresJson as { [key: string]: number },
          ),
        )
      : new Map<string, number>();

    const currentLeader = prismaTournament.currentLeader
      ? coupleMap.get(prismaTournament.currentLeader.id)
      : undefined;

    const winners = prismaTournament.winners.map(
      (c: any) => coupleMap.get(c.id)!,
    );

    const tournament: Tournament = {
      id: prismaTournament.id,
      name: prismaTournament.name,
      numberOfCourts: prismaTournament.numberOfCourts,
      couples,
      matches,
      currentLeader,
      currentMatchNumber: prismaTournament.currentMatchNumber,
      scores,
      winners,
      currentLeaderId: prismaTournament.currentLeaderId,
      scoresJson: prismaTournament.scoresJson,
      createdAt: prismaTournament.createdAt,
      updatedAt: prismaTournament.updatedAt,
    };

    return tournament;
  }
}
