"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

function ThemeToggleContent({
  className = "",
  size = "default",
  variant = "ghost",
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`theme-toggle-button ${className}`}
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`theme-toggle-button group transition-all duration-300 hover:scale-105 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:text-blue-400" />
      )}
    </Button>
  );
}

export function ThemeToggle(props: ThemeToggleProps) {
  return (
    <ClientOnly
      fallback={
        <Button
          variant={props.variant || "ghost"}
          size={props.size || "default"}
          className={`theme-toggle-button ${props.className || ""}`}
          disabled
        >
          <Sun className="h-4 w-4" />
        </Button>
      }
    >
      <ThemeToggleContent {...props} />
    </ClientOnly>
  );
}
