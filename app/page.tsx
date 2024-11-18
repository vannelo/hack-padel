import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-black">
      <div className="absolute inset-0 z-20 flex min-h-[100vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <Image
            src="/img/hack-logo.png"
            alt="Hack Padel Logo"
            width={300}
            height={150}
          />
          <h2 className="mt-4 text-xl font-bold uppercase text-white">
            Primera cancha de padel en Lindavista
          </h2>
        </div>
      </div>
    </div>
  );
}
