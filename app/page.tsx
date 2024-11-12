import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <div className="absolute inset-0 z-20 min-h-[100vh] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Image
            src="/img/hack-logo.png"
            alt="Hack Padel Logo"
            width={300}
            height={150}
          />
          <h2 className="text-white text-xl font-bold mt-4 uppercase">
            Próximamente
          </h2>
        </div>
      </div>
    </div>
  );
}
