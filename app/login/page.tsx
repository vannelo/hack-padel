"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import HackPadelLogo from "@/components/Layout/HackPadelLogo/HackPadelLogo";
import Button from "@/components/UI/Button/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          router.push(data.redirectUrl);
        } else {
          alert("Login failed!");
        }
      } else {
        alert("Login failed!");
      }
      // eslint-disable-next-line
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex min-h-[100vh] items-center justify-center bg-black p-8 text-white">
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center">
          <HackPadelLogo width={120} height={150} />
        </div>
        <div className="mx-auto mt-8 w-full max-w-xs text-center">
          <div className="login-container flex flex-col gap-4">
            {error && <p className="error">{error}</p>}
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-b-2 border-white bg-transparent text-center text-white outline-none transition-all duration-500 ease-in-out hover:border-primary focus:border-primary"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-white bg-transparent text-center text-white outline-none transition-all duration-500 ease-in-out hover:border-primary focus:border-primary"
                required
              />
              <Button type="submit" isLoading={loading}>
                Entrar{" "}
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black">
                  <svg
                    className="h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
