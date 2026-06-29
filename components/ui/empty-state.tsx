import React from "react";
import { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg mx-auto shadow-soft-1",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="p-3 bg-neutral-100/50 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-700/20 text-neutral-400 rounded-xl mb-4">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-heading-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </h3>
      <p className="text-caption text-neutral-500 mt-2 max-w-sm leading-normal">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
