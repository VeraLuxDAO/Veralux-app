"use client";

import { cn } from "@/lib/utils";

interface LighthouseLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function LighthouseLogo({
  className,
  size = "md",
  onClick,
}: LighthouseLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "lighthouse-logo cursor-pointer transition-transform hover:scale-105",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lighthouse Base */}
        <rect
          x="35"
          y="70"
          width="30"
          height="25"
          rx="2"
          className="fill-primary"
        />

        {/* Lighthouse Tower */}
        <path d="M42 70 L58 70 L56 20 L44 20 Z" className="fill-primary" />

        {/* Light House Top */}
        <rect
          x="40"
          y="15"
          width="20"
          height="8"
          rx="4"
          className="fill-veralux-yellow"
        />

        {/* Light Beams */}
        <path
          d="M20 25 L35 20 L35 30 Z"
          className="fill-veralux-yellow opacity-60"
        />
        <path
          d="M80 25 L65 20 L65 30 Z"
          className="fill-veralux-yellow opacity-60"
        />
        <path
          d="M50 5 L45 15 L55 15 Z"
          className="fill-veralux-yellow opacity-60"
        />

        {/* Stripes */}
        <rect x="42" y="30" width="16" height="3" className="fill-white" />
        <rect x="42" y="40" width="16" height="3" className="fill-white" />
        <rect x="42" y="50" width="16" height="3" className="fill-white" />
        <rect x="42" y="60" width="16" height="3" className="fill-white" />

        {/* Door */}
        <rect
          x="47"
          y="80"
          width="6"
          height="10"
          rx="3"
          className="fill-background"
        />

        {/* Water Waves */}
        <path
          d="M10 90 Q20 85 30 90 T50 90 T70 90 T90 90"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary opacity-40"
        />
        <path
          d="M5 95 Q15 92 25 95 T45 95 T65 95 T85 95"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-primary opacity-30"
        />
      </svg>
    </div>
  );
}
