import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex flex-col md:flex-row md:items-start md:justify-between pb-6 border-b border-neutral-200/50 dark:border-neutral-800/30 gap-4 mb-8",
        className
      )}
      {...props}
    >
      <div className="space-y-1.5">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium select-none">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-neutral-500 font-semibold" : ""}>{crumb.label}</span>
                  )}
                  {!isLast && <ChevronRight className="h-3 w-3" />}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <h1 className="text-heading-xl font-semibold text-neutral-900 dark:text-white tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-caption text-neutral-500 max-w-2xl leading-normal">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-shrink-0 md:mt-4">
          {actions}
        </div>
      )}
    </div>
  );
}
