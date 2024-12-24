"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import ArrowRight from "@/components/Icons/ArrowRight/ArrowRight";
import Button from "@/components/UI/Button/Button";

const LoginForm: React.FC = ({}) => {
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
    <div className="mx-auto mt-8 w-full max-w-xs text-center">
      <div className="login-container flex flex-col gap-4">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
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
            Entrar <ArrowRight />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
