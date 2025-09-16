import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link href="/" className="flex items-center space-x-2">
      <span
        className={cn(
          "font-bold bg-gradient-to-r from-white to-ibias-accent-400 bg-clip-text text-transparent",
          sizeClasses[size],
          className
        )}
      >
        IBIAS
      </span>
    </Link>
  );
}