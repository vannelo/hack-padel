import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={300}
          height={150}
        />
        <h3 className="mt-4">Primera cancha de padel en Lindavista</h3>
      </div>
    </div>
  );
}
