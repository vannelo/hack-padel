import { NextResponse, NextRequest } from "next/server";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";

export async function GET(request: NextRequest) {
  try {
    // Extract the 'id' parameter from the request URL
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Tournament ID is missing" },
        { status: 400 },
      );
    }

    const tournamentRepository = new TournamentRepository();
    const tournament = await tournamentRepository.getTournamentById(id);

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error("Error in GET /api/tournaments/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch tournament" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { error: "Tournament ID is missing" },
        { status: 400 },
      );
    }

    const tournamentRepository = new TournamentRepository();
    const existingTournament = await tournamentRepository.getTournamentById(id);

    if (!existingTournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    const updates = await request.json();

    // Process updates
    const processedUpdates = {
      ...updates,
      couples: updates.couples?.map((couple: any) => ({
        id: couple.id,
        tournamentId: couple.tournamentId,
        player1Id: couple.player1?.id,
        player2Id: couple.player2?.id,
      })),
      matches: updates.matches?.map((match: any) => ({
        id: match.id,
        tournamentId: match.tournamentId,
        couple1Id: match.couple1?.id,
        couple2Id: match.couple2?.id,
        couple1Score: match.couple1Score,
        couple2Score: match.couple2Score,
      })),
      scores:
        updates.scores && typeof updates.scores === "object"
          ? new Map(Object.entries(updates.scores))
          : new Map(),
      winners: updates.winners?.map((winner: any) => ({ id: winner.id })),
    };

    // Update the tournament in the database
    await tournamentRepository.updateTournament({
      ...existingTournament,
      ...processedUpdates,
    });

    return NextResponse.json({ message: "Tournament updated" });
  } catch (error) {
    console.error("Error in PUT /api/tournaments/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update tournament" },
      { status: 500 },
    );
  }
}
