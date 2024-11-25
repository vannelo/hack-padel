import Image from "next/image";
import Link from "next/link";

export default function Admin() {
  return (
    <div className="flex min-h-[100vh] items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={300}
          height={150}
        />
        <h3 className="mt-4 font-bold">Admin</h3>
      </div>
    </div>
  );
}
