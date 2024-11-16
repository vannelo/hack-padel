import { NextResponse } from "next/server";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";
import { tournamentService } from "@/domain";
import { v4 as uuidv4 } from "uuid";
import { Couple } from "@/domain/models/Couple";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, couples, numberOfCourts } = body;

    if (!name || !couples || !numberOfCourts) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const initialCouples: Couple[] = couples.map((name: string) => ({
      id: uuidv4(),
      name,
    }));

    const tournament = tournamentService.createTournament(
      name,
      initialCouples,
      numberOfCourts,
    );

    const tournamentRepository = new TournamentRepository();
    await tournamentRepository.createTournament(tournament);

    return NextResponse.json({ id: tournament.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/tournaments:", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 },
    );
  }
}
