"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function NetworkDetector() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatusAlert, setShowStatusAlert] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(window.navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setShowStatusAlert(true);
        // Dismiss "Back Online" alert after 3s
        setTimeout(() => setShowStatusAlert(false), 3000);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setShowStatusAlert(true);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (isOnline && !showStatusAlert) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-up max-w-sm w-max font-sans">
      {!isOnline ? (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-rose-500 text-white rounded-xl shadow-premium-lg border border-rose-600/30 text-caption font-semibold">
          <WifiOff className="h-4.5 w-4.5 animate-pulse" />
          <span>Koneksi Terputus. Anda sedang bekerja secara offline.</span>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-emerald-500 text-white rounded-xl shadow-premium-lg border border-emerald-600/30 text-caption font-semibold">
          <Wifi className="h-4.5 w-4.5" />
          <span>Terhubung Kembali! Mensinkronkan data...</span>
        </div>
      )}
    </div>
  );
}
