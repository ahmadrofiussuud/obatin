import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

export function Avatar({ src, name, size = "md", isOnline = false, className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-[11px]",
    md: "h-10 w-10 text-[13px]",
    lg: "h-12 w-12 text-[15px]",
  };

  const indicatorSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  // Get initials: Budi Santoso -> BS
  const getInitials = (userName: string) => {
    const parts = userName.trim().split(" ");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div className={twMerge("relative inline-block select-none", className)} {...props}>
      <div
        className={clsx(
          "rounded-full overflow-hidden flex items-center justify-center font-semibold bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200/50 dark:border-neutral-700/50",
          sizeClasses[size]
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            width={120}
            height={120}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {isOnline && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-950",
            indicatorSizes[size]
          )}
        />
      )}
    </div>
  );
}
