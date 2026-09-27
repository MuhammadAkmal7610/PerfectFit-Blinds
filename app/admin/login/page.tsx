"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || "Unable to sign in.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <BackButton />
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
        <p className="text-sm font-semibold text-sky-800">Admin sign in</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-slate-900">PerfectFit Blinds</h1>
        <p className="mt-2 text-sm text-slate-600">Access the lead management dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100" />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-100" />
          </label>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

      </div>
    </div>
  );
}
