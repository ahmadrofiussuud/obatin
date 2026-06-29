import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant = "ACTIVE" | "INACTIVE" | "PENDING" | "CRITICAL" | "STABLE";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant, children, className, ...props }: BadgeProps) {
  const styles = {
    ACTIVE: "bg-secondary-50 text-secondary border-secondary-200/50 dark:bg-secondary-950/20 dark:text-secondary-400 dark:border-secondary-900/30",
    INACTIVE: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800/30 dark:text-neutral-400 dark:border-neutral-700/30",
    PENDING: "bg-warning-50 text-warning-600 border-warning-200/50 dark:bg-warning-950/20 dark:text-warning-400 dark:border-warning-900/30",
    CRITICAL: "bg-destructive-50 text-destructive border-destructive-200/50 dark:bg-destructive-950/20 dark:text-destructive-400 dark:border-destructive-900/30",
    STABLE: "bg-primary-50 text-primary border-primary-200/50 dark:bg-primary-950/20 dark:text-primary-400 dark:border-primary-900/30",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold leading-none select-none tracking-wide",
          styles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
