import Image from "next/image";
import TournamentCreation from "@/components/Tournament/TournamentCreation/TournamentCreation";

export default function Home() {
  return (
    <main className="flex min-h-[100vh] items-center justify-center p-8">
      <div className="flex w-full flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={500}
          height={150}
        />
        <TournamentCreation />
      </div>
    </main>
  );
}
