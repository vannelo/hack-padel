// domain/repositories/TournamentRepository.ts
import { PrismaClient } from "@prisma/client";
import { ITournamentRepository } from "./ITournamentRepository";
import { Tournament } from "../models/Tournament";
import { Couple } from "../models/Couple";
import { Match } from "../models/Match";

const prisma = new PrismaClient();

export class TournamentRepository implements ITournamentRepository {
  async createTournament(tournament: Tournament): Promise<Tournament> {
    const createdTournament = await prisma.tournament.create({
      data: {
        id: tournament.id,
        name: tournament.name,
        currentMatchNumber: tournament.currentMatchNumber,
        numberOfCourts: tournament.numberOfCourts,
        couples: {
          create: tournament.couples.map((couple) => ({
            id: couple.id,
            player1Id: couple.player1?.id!,
            player2Id: couple.player2?.id!,
          })),
        },
        matches: {
          create: tournament.matches.map((match) => ({
            id: match.id,
            couple1Id: match.couple1.id,
            couple2Id: match.couple2.id,
            couple1Score: match.couple1Score,
            couple2Score: match.couple2Score,
          })),
        },
        currentLeaderId: tournament.currentLeader?.id,
        winners: {
          connect:
            tournament.winners?.map((winner) => ({ id: winner.id })) || [],
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
        winners: true,
      },
    });

    return this.mapPrismaTournamentToDomain(createdTournament);
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
        matches: true, // Ensure matches are included
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

  async updateTournament(tournament: Tournament): Promise<Tournament> {
    const scoresObject =
      tournament.scores instanceof Map
        ? Object.fromEntries(tournament.scores)
        : {};

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
              couple1Id: match.couple1.id,
              couple2Id: match.couple2.id,
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
    };

    return tournament;
  }
}
