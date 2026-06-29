"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type = "info" }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        dismiss(id);
      }, 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Toast Panel Overlay Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex gap-3 p-4 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl shadow-premium-lg animate-pulse-subtle transition-all duration-300 transform translate-y-0 scale-100"
          >
            {/* Status Icons */}
            <div className="flex-shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {t.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {t.type === "error" && <AlertCircle className="h-5 w-5 text-rose-500" />}
              {t.type === "info" && <Info className="h-5 w-5 text-primary" />}
            </div>

            {/* Content Text */}
            <div className="flex-grow space-y-0.5">
              <h4 className="text-caption font-semibold text-neutral-900 dark:text-white leading-none">
                {t.title}
              </h4>
              {t.description && (
                <p className="text-[11px] text-neutral-500 leading-normal">
                  {t.description}
                </p>
              )}
            </div>

            {/* Close trigger */}
            <button
              onClick={() => dismiss(t.id)}
              className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 h-4 w-4 p-0.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
