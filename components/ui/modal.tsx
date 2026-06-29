"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-neutral-950/45 dark:bg-neutral-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div
        className={twMerge(
          "relative w-full bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/40 rounded-2xl shadow-premium-lg flex flex-col max-h-[85vh] overflow-hidden z-10 transition-all duration-200 transform scale-100",
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Title Bar Header */}
        <div className="flex items-start justify-between p-5 border-b border-neutral-200/50 dark:border-neutral-800/30">
          <div>
            <h3 className="text-heading-sm font-semibold text-neutral-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-caption leading-relaxed text-neutral-600 dark:text-neutral-300">
          {children}
        </div>

        {/* Footer controls */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-5 bg-neutral-50/50 dark:bg-neutral-800/20 border-t border-neutral-200/50 dark:border-neutral-800/30">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
