import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number; // relative change, e.g. +12.4 or -2.3
  changeLabel?: string; // e.g. "dari bulan lalu"
  icon?: LucideIcon;
  sparklineData?: number[]; // list of heights to draw mini line
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs minggu lalu",
  icon: Icon,
  sparklineData,
  className,
  ...props
}: StatCardProps) {
  const isPositive = change !== undefined ? change >= 0 : true;

  // Convert numbers list to standard SVG polyline coordinates
  const getPolylinePoints = (data: number[]) => {
    const width = 80;
    const height = 24;
    const padding = 2;
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    return data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
        return `${x},${y}`;
      })
      .join(" ");
  };

  return (
    <div
      className={twMerge(
        "glass-panel p-5 rounded-xl border border-neutral-200/50 dark:border-neutral-800/40 shadow-soft-1 flex flex-col justify-between h-32 hover:border-neutral-300/80 dark:hover:border-neutral-700/60 transition-all duration-150",
        className
      )}
      {...props}
    >
      {/* Top details */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-caption text-neutral-500 font-medium tracking-tight">
            {title}
          </span>
          <div className="text-heading-lg font-semibold text-neutral-900 dark:text-white mt-0.5">
            {value}
          </div>
        </div>
        {Icon && (
          <div className="p-2 bg-neutral-100/50 dark:bg-neutral-800/40 rounded-lg text-neutral-500 border border-neutral-200/40 dark:border-neutral-700/20">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      {/* Bottom trend & sparkline */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100/50 dark:border-neutral-800/20">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={clsx(
                "inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none",
                isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                  : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-[10px] text-neutral-400 font-medium">
              {changeLabel}
            </span>
          </div>
        ) : (
          <div className="text-[10px] text-neutral-400 font-medium">Status Aktif</div>
        )}

        {sparklineData && sparklineData.length > 1 && (
          <svg className="h-6 w-20 overflow-visible" viewBox="0 0 80 24">
            <polyline
              fill="none"
              stroke={isPositive ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={getPolylinePoints(sparklineData)}
            />
          </svg>
        )}
      </div>
    </div>
  );
}
