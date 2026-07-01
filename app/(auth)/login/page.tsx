"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error || "Gagal masuk. Periksa kembali email dan kata sandi Anda.");
      } else {
        router.refresh();
        router.push("/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  // Helper helper to login with mock user roles instantly for development ease
  const handleQuickLogin = async (role: "patient" | "doctor" | "admin") => {
    setLoading(true);
    setError(null);
    let mockEmail = "patient@medilink.id";
    const mockPassword = "password123";

    if (role === "doctor") {
      mockEmail = "doctor@medilink.id";
    } else if (role === "admin") {
      mockEmail = "admin@medilink.id";
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: mockEmail,
        password: mockPassword,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.refresh();
        // Middleware will redirect the user correctly depending on role
        if (role === "patient") router.push("/dashboard/patient");
        else if (role === "doctor") router.push("/dashboard/doctor");
        else if (role === "admin") router.push("/dashboard/admin");
      }
    } catch {
      setError("Gagal melakukan Quick Login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="w-full max-w-md bg-card border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-premium-lg p-8 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center px-3 py-1 bg-primary/10 text-primary rounded-full text-label-caps font-bold">
            MediLink Indonesia
          </div>
          <h1 className="text-heading-lg font-bold text-neutral-900 dark:text-white">
            Masuk ke Akun Anda
          </h1>
          <p className="text-caption text-neutral-500">
            Akses rekam medis digital terintegrasi blockchain.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-500 text-caption rounded-lg text-center animate-shake">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-850 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary text-neutral-900 dark:text-neutral-100 placeholder-neutral-450 font-medium"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-caption font-semibold text-neutral-700 dark:text-neutral-300">
                Kata Sandi
              </label>
              <a href="#" className="text-[11px] text-primary hover:underline font-bold">Lupa sandi?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-850 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary text-neutral-900 dark:text-neutral-100 placeholder-neutral-450 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-bold transition-all disabled:opacity-50 active-scale focus-ring cursor-pointer"
          >
            {loading ? "Menghubungkan..." : "Masuk"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center select-none">
          <div className="flex-grow border-t border-neutral-250 dark:border-neutral-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-neutral-400 text-label-caps font-bold">atau</span>
          <div className="flex-grow border-t border-neutral-250 dark:border-neutral-800"></div>
        </div>

        {/* OAuth Integration Mock */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full py-2.5 bg-card hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg text-caption font-semibold flex items-center justify-center gap-2 text-neutral-750 dark:text-neutral-200 transition-all active-scale focus-ring cursor-pointer"
        >
          {/* Simple google SVG icon */}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.535 0-6.4-2.865-6.4-6.4 0-3.535 2.865-6.4 6.4-6.4 1.582 0 3.023.578 4.137 1.528l3.123-3.124C19.09 2.052 15.89 1 12.24 1 6.142 1 1.2 5.942 1.2 12s4.942 11 11.04 11c6.16 0 10.743-4.32 10.743-10.923 0-.663-.06-1.302-.171-1.792H12.24Z"
            />
          </svg>
          Masuk dengan Google
        </button>

        {/* Quick login sandbox helper */}
        <div className="pt-4 border-t border-neutral-250 dark:border-neutral-800 space-y-2 select-none">
          <div className="text-[10px] text-neutral-400 text-center font-bold text-label-caps">Sandbox Quick Login</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin("patient")}
              className="py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded text-[11px] font-semibold text-neutral-750 dark:text-neutral-300 transition-all active-scale cursor-pointer"
            >
              Pasien
            </button>
            <button
              onClick={() => handleQuickLogin("doctor")}
              className="py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded text-[11px] font-semibold text-neutral-750 dark:text-neutral-300 transition-all active-scale cursor-pointer"
            >
              Dokter
            </button>
            <button
              onClick={() => handleQuickLogin("admin")}
              className="py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded text-[11px] font-semibold text-neutral-750 dark:text-neutral-300 transition-all active-scale cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
