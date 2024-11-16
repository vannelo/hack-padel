import { NextResponse } from "next/server";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";

export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const tournamentRepository = new TournamentRepository();
    const tournament = await tournamentRepository.getTournamentById(
      context.params.id,
    );

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
  context: { params: { id: string } },
) {
  try {
    const tournamentRepository = new TournamentRepository();
    const existingTournament = await tournamentRepository.getTournamentById(
      context.params.id,
    );

    if (!existingTournament) {
      return NextResponse.json(
        { error: "Tournament not found" },
        { status: 404 },
      );
    }

    const updates = await request.json();
    const updatedTournament = {
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
