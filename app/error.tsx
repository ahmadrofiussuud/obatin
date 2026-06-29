"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Global Error Exception]:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAF8] dark:bg-[#0A0B0D] font-sans text-neutral-800 dark:text-neutral-200">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800/40 rounded-2xl shadow-premium-lg p-8 select-none animate-shake">
        
        {/* Warn Icon */}
        <div className="mx-auto p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-3xl w-max">
          <AlertTriangle className="h-10 w-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-display-md font-bold text-rose-550 dark:text-rose-400 leading-none">500</h1>
          <h2 className="text-heading-md font-semibold text-neutral-805 dark:text-neutral-200 leading-tight">
            Kegagalan Sistem Internal
          </h2>
          <p className="text-caption text-neutral-500 leading-relaxed max-w-[300px] mx-auto">
            Server gagal merespon data faskes. Silakan coba muat kembali halaman beberapa saat lagi.
          </p>
        </div>

        <div className="p-3 bg-neutral-50 dark:bg-neutral-850/50 border border-neutral-150 dark:border-neutral-800/50 rounded-lg text-left text-caption">
          <div className="text-[9px] font-bold text-neutral-450 uppercase mb-1">Pesan Kesalahan</div>
          <code className="text-[10px] text-neutral-600 dark:text-neutral-400 break-all font-mono">
            {error.digest || error.message || "ERR_INTERNAL_SERVER"}
          </code>
        </div>

        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/50">
          <button
            onClick={reset}
            className="w-full py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl text-caption font-semibold flex items-center justify-center gap-2 shadow-premium-sm transition-all active-scale focus-ring cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Muat Ulang Halaman
          </button>
        </div>

      </div>
    </div>
  );
}
