"use client";

import React from "react";
import { StatCardSkeleton, TableRowSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse-subtle">
      {/* Page Header Skeleton */}
      <div className="space-y-2 pb-6 border-b border-neutral-200/50 dark:border-neutral-800/30">
        <div className="h-3 w-32 bg-neutral-200/60 dark:bg-neutral-800/55 rounded" />
        <div className="h-8 w-60 bg-neutral-200/60 dark:bg-neutral-800/55 rounded" />
        <div className="h-4 w-96 bg-neutral-200/60 dark:bg-neutral-800/55 rounded" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Main Grid Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="h-6 w-48 bg-neutral-200/60 dark:bg-neutral-800/55 rounded" />
          <div className="border border-neutral-200/60 dark:border-neutral-800/40 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <div className="h-6 w-40 bg-neutral-200/60 dark:bg-neutral-800/55 rounded" />
          <div className="h-48 bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/40 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
