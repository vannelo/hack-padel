// app/api/tournaments/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";
import { Tournament } from "@/domain/models/Tournament";

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
    // Extract the 'id' parameter from the request URL
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

    // Merge updates into existing tournament
    const updatedTournament: Tournament = {
      ...existingTournament,
      ...updates,
    };

    await tournamentRepository.updateTournament(updatedTournament);

    return NextResponse.json({ message: "Tournament updated" });
  } catch (error) {
    console.error("Error in PUT /api/tournaments/[id]:", error);
    return NextResponse.json(
      { error: "Failed to update tournament" },
      { status: 500 },
    );
  }
}
