import { NextResponse } from "next/server";
import { PlayerService } from "@/domain/services/PlayerService";

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
