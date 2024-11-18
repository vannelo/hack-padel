import { getTournamentById } from "@/app/actions/tournamentActions";
import TournamentComponent from "@/components/Tournament/Tournament";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const tournament = await getTournamentById(id);

  if (!tournament) {
    notFound();
  }

  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-black p-8">
      <div className="flex w-full flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={200}
          height={150}
        />
        <TournamentComponent fetchedTournament={tournament} />
      </div>
    </main>
  );
}
