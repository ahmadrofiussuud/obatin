"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nik, setNik] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Call API signup route
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, nik, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat akun.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-premium-lg p-8 space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center px-3 py-1 bg-secondary/10 text-secondary rounded-full text-label-caps">
            Pendaftaran Pasien Baru
          </div>
          <h1 className="text-heading-lg font-bold text-neutral-900 dark:text-white">
            Buat Akun MediLink
          </h1>
          <p className="text-caption text-neutral-500">
            Daftarkan diri Anda untuk mengintegrasikan rekam medis nasional.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-destructive-50 border border-destructive/20 text-destructive text-caption rounded-lg text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-caption rounded-lg text-center">
            Akun berhasil dibuat! Mengalihkan ke halaman masuk...
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Nama Lengkap (Sesuai KTP)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Budi Santoso"
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              NIK (16 Digit Nomor Induk Kependudukan)
            </label>
            <input
              type="text"
              required
              maxLength={16}
              minLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              placeholder="3171012345670001"
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@email.com"
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-caption font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 bg-transparent rounded-lg text-caption focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-secondary hover:bg-secondary-600 text-white rounded-lg text-caption font-bold transition-all disabled:opacity-50"
          >
            {loading ? "Mendaftarkan..." : "Daftar Akun"}
          </button>
        </form>

        <div className="text-center text-caption text-neutral-500">
          Sudah punya akun?{" "}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Masuk di sini
          </a>
        </div>

      </div>
    </div>
  );
}
