"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const AdminNav: React.FC = () => {
  const [pageActive, setPageActive] = React.useState<string>("");

  React.useEffect(() => {
    setPageActive(window.location.pathname);
  }, []);

  return (
    <nav className="flex items-center justify-between bg-black px-8 py-4 text-white">
      <Link href="/admin">
        <Image
          src="/img/hack-logo.png"
          alt="Hack Padel Logo"
          width={120}
          height={150}
        />
      </Link>
      <ul className="flex gap-8 font-semibold">
        <li>
          <Link
            href="/admin/jugadores"
            className={`transition-colors duration-300 ${pageActive === "/jugadores" ? "text-primary" : "hover:text-primary"} `}
          >
            Jugadores
          </Link>
        </li>
        <li>
          <Link
            href="/admin/torneos"
            className={`transition-colors duration-300 ${pageActive === "/torneos" ? "text-primary" : "hover:text-primary"} `}
          >
            Torneos
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;
