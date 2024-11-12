import Image from "next/image";
import TournamentComponent from "../../components/Tournament/Tournament";

export default function Home() {
  return (
    <main className="flex min-h-[100vh] items-center justify-center p-8">
      <div className="flex w-full flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={200}
          height={150}
        />
        <TournamentComponent />
      </div>
    </main>
  );
}
