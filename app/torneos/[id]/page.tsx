import TournamentComponent from "@/components/Tournament/Tournament";
import { TournamentRepository } from "@/domain/repositories/TournamentRepository";
import Image from "next/image";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const tournamentRepository = new TournamentRepository();
  const tournament = await tournamentRepository.getTournamentById(id);

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <main className="flex min-h-[100vh] items-center justify-center p-8">
      <div className="flex w-full flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={200}
          height={150}
        />
        <TournamentComponent initialTournament={tournament} />
      </div>
    </main>
  );
}
