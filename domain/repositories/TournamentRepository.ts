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
            name: couple.name,
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
      },
      include: {
        couples: true,
        matches: true,
      },
    });

    return this.mapPrismaTournamentToDomain(createdTournament);
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    const prismaTournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        couples: true,
        matches: true,
      },
    });

    if (!prismaTournament) return null;

    return this.mapPrismaTournamentToDomain(prismaTournament);
  }

  async updateTournament(tournament: Tournament): Promise<Tournament> {
    const updatedTournament = await prisma.tournament.update({
      where: { id: tournament.id },
      data: {
        currentLeaderId: tournament.currentLeader?.id,
        currentMatchNumber: tournament.currentMatchNumber,
        numberOfCourts: tournament.numberOfCourts,
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
      },
      include: {
        couples: true,
        matches: true,
      },
    });

    return this.mapPrismaTournamentToDomain(updatedTournament);
  }

  private mapPrismaTournamentToDomain(prismaTournament: any): Tournament {
    const couples: Couple[] = prismaTournament.couples.map((c: any) => ({
      id: c.id,
      name: c.name,
    }));

    const coupleMap = new Map<string, Couple>();
    couples.forEach((c) => coupleMap.set(c.id, c));

    const matches: Match[] = prismaTournament.matches.map((m: any) => ({
      id: m.id,
      couple1: coupleMap.get(m.couple1Id)!,
      couple2: coupleMap.get(m.couple2Id)!,
      couple1Score: m.couple1Score ?? undefined,
      couple2Score: m.couple2Score ?? undefined,
    }));

    const scores = new Map<string, number>();
    couples.forEach((c) => {
      scores.set(c.id, 0);
    });

    matches.forEach((match) => {
      if (match.couple1Score !== undefined) {
        const currentScore1 = scores.get(match.couple1.id) || 0;
        scores.set(match.couple1.id, currentScore1 + match.couple1Score!);

        const currentScore2 = scores.get(match.couple2.id) || 0;
        scores.set(match.couple2.id, currentScore2 + match.couple2Score!);
      }
    });

    const tournament: Tournament = {
      id: prismaTournament.id,
      name: prismaTournament.name,
      numberOfCourts: prismaTournament.numberOfCourts,
      couples,
      matches,
      currentLeader: prismaTournament.currentLeaderId
        ? coupleMap.get(prismaTournament.currentLeaderId)
        : undefined,
      currentMatchNumber: prismaTournament.currentMatchNumber,
      scores,
      winners: [],
    };

    return tournament;
  }
}
