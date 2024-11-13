import { NextResponse } from "next/server";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";
import { Tournament } from "@/domain/models/Tournament";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const tournamentRepository = new TournamentRepository();
    const tournament = await tournamentRepository.getTournamentById(params.id);

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tournament);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tournament" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const tournamentRepository = new TournamentRepository();
    const existingTournament = await tournamentRepository.getTournamentById(
      params.id,
    );

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
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update tournament" },
      { status: 500 },
    );
  }
}
