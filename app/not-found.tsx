"use client";

import React from "react";
import Link from "next/link";
import { Stethoscope, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAF8] dark:bg-[#0A0B0D] font-sans text-neutral-800 dark:text-neutral-200">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800/40 rounded-2xl shadow-premium-lg p-8 select-none">
        
        {/* Medical Cross illustration */}
        <div className="mx-auto p-4 bg-primary/10 dark:bg-primary-950/20 text-primary rounded-3xl w-max animate-bounce">
          <Stethoscope className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-display-md font-bold text-neutral-900 dark:text-white leading-none">404</h1>
          <h2 className="text-heading-md font-semibold text-neutral-805 dark:text-neutral-200 leading-tight">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-caption text-neutral-500 leading-relaxed max-w-[280px] mx-auto">
            Berkas medis digital yang Anda cari tidak ada atau alamat URL salah dimasukkan.
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
          <Link href="/dashboard">
            <button className="w-full py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl text-caption font-semibold flex items-center justify-center gap-2 shadow-premium-sm transition-all active-scale focus-ring cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
