"use client";

import Link from "next/link";
import React from "react";
import HackPadelLogo from "../HackPadelLogo/HackPadelLogo";

const AdminNav: React.FC = () => {
  const [pageActive, setPageActive] = React.useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setPageActive(window.location.pathname);
  }, []);

  return (
    <nav className="bg-black px-8 py-4 text-white">
      <div className="flex items-center justify-between">
        <Link href="/">
          <HackPadelLogo width={120} height={150} />
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="block focus:outline-none lg:hidden"
          aria-label="Open navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <ul
          className={`fixed left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-start bg-black text-center transition-transform duration-300 lg:static lg:flex lg:h-auto lg:w-auto lg:flex-row lg:gap-8 lg:bg-transparent lg:text-left ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Close Button */}
          <div className="relative w-full">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute right-4 top-4 text-white focus:outline-none lg:hidden"
              aria-label="Close navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Logo for Mobile */}
          <div className="my-8 lg:hidden">
            <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
              <HackPadelLogo width={120} height={150} />
            </Link>
          </div>

          <li className="mb-4 lg:mb-0">
            <Link
              href="/admin/jugadores"
              className={`text-lg font-semibold transition-colors duration-300 ${
                pageActive === "/admin/jugadores"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Jugadores
            </Link>
          </li>
          <li>
            <Link
              href="/admin/torneos"
              className={`text-lg font-semibold transition-colors duration-300 ${
                pageActive === "/admin/torneos"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Torneos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNav;
