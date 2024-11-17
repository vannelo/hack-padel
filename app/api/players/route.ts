import { NextResponse } from "next/server";
import { PlayerService } from "@/domain/services/PlayerService";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const playerData = await request.json();
    const playerService = new PlayerService();
    const newPlayer = await playerService.createPlayer(playerData);

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Failed to create player" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const players = await prisma.player.findMany();
    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 },
    );
  }
}
