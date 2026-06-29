import React from "react";
import { twMerge } from "tailwind-merge";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        "animate-pulse bg-neutral-200/60 dark:bg-neutral-800/50 rounded-lg",
        className
      )}
      {...props}
    />
  );
}

// 1. StatCard Skeleton
export function StatCardSkeleton() {
  return (
    <div className="glass-panel p-5 rounded-xl border border-neutral-200/50 dark:border-neutral-800/40 shadow-soft-1 h-32 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-8.5 w-8.5 rounded-lg" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-neutral-100/50 dark:border-neutral-800/20">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

// 2. Table Row Skeleton
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-6 border-b border-neutral-100 dark:border-neutral-800">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-12 ml-auto" />
    </div>
  );
}
