"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error details to server audit tools in production
    console.error("[Dashboard Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/40 rounded-2xl shadow-premium-lg p-8 space-y-6">
        
        {/* Warning Icon */}
        <div className="mx-auto p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-500 rounded-2xl w-max">
          <AlertCircle className="h-8 w-8" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-heading-md font-semibold text-neutral-900 dark:text-white">
            Terjadi Gangguan Sistem
          </h2>
          <p className="text-caption text-neutral-500 leading-relaxed">
            Gagal memuat rekam medis atau data server. Pastikan koneksi internet Anda stabil atau coba hubungi IT faskes.
          </p>
        </div>

        {/* Technical details block */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800/50 rounded-lg text-left">
          <div className="text-[9px] font-bold text-neutral-400 text-label-caps mb-1">Kode Gangguan</div>
          <code className="text-[10px] text-neutral-600 dark:text-neutral-400 break-all font-mono">
            {error.digest || error.message || "ERR_SYS_UNKNOWN"}
          </code>
        </div>

        {/* Actions */}
        <button
          onClick={reset}
          className="w-full py-2.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-caption font-semibold flex items-center justify-center gap-2 shadow-premium-sm transition-all focus-ring cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Ulangi Memuat Data
        </button>

      </div>
    </div>
  );
}
