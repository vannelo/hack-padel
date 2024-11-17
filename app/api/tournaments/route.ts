import { NextResponse } from "next/server";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";
import { v4 as uuidv4 } from "uuid";
import { TournamentService } from "@/domain/services/TournamentService";
import { prisma } from "@/lib/prisma";
import { Player } from "@/domain/models/Player";

const tournamentRepository = new TournamentRepository();
const tournamentService = new TournamentService();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, couples, numberOfCourts } = data;

    // Validate tournament data
    if (typeof name !== "string" || typeof numberOfCourts !== "number") {
      throw new Error("Invalid tournament data.");
    }

    // Validate couples input
    if (
      !Array.isArray(couples) ||
      couples.some(
        (c: any) =>
          !c ||
          typeof c.player1Id !== "string" ||
          typeof c.player2Id !== "string" ||
          !c.player1Id ||
          !c.player2Id,
      )
    ) {
      throw new Error("Invalid couples data: Ensure all pairs are complete.");
    }

    // Fetch players from the database
    const playerIds = couples.flatMap((c: any) => [c.player1Id, c.player2Id]);
    const players = await prisma.player.findMany({
      where: { id: { in: playerIds } },
    });

    // Check if all player IDs exist
    if (players.length !== new Set(playerIds).size) {
      const missingIds = playerIds.filter(
        (id) => !players.some((player) => player.id === id),
      );
      throw new Error(
        `Some players not found in the database: ${missingIds.join(", ")}`,
      );
    }

    const playerMap = new Map<string, Player>();
    players.forEach((player) => {
      playerMap.set(player.id, {
        id: player.id,
        name: player.name,
        email: player.email ?? null,
        age: player.age ?? null,
        phone: player.phone ?? null,
        // @ts-ignore
        gender: player.gender!,
        // @ts-ignore
        level: player.level!,
      });
    });

    // Map couples with player objects
    const coupleEntities = couples.map((c: any) => {
      const player1 = playerMap.get(c.player1Id);
      const player2 = playerMap.get(c.player2Id);

      if (!player1 || !player2) {
        throw new Error(
          `Invalid couple: Missing player data for IDs ${c.player1Id} or ${c.player2Id}`,
        );
      }

      return {
        id: uuidv4(),
        player1,
        player2,
      };
    });

    const newTournament = tournamentService.createTournament(
      name,
      coupleEntities,
      numberOfCourts,
    );

    // Save the tournament to the database
    const createdTournament =
      await tournamentRepository.createTournament(newTournament);

    return NextResponse.json(createdTournament, { status: 201 });
  } catch (error) {
    console.error("Error creating tournament:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create tournament",
      },
      { status: 500 },
    );
  }
}
