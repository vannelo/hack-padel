import Image from "next/image";

export default function Admin() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center bg-black p-64 text-white">
      <Image
        src="/img/hack-logo.png"
        alt="Hack Padel Logo"
        width={300}
        height={150}
      />
      <h3 className="mt-4 font-bold">Admin</h3>
    </div>
  );
}
