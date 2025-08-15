"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative h-9 w-9 rounded-full border-2"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative h-9 w-9 rounded-full border-2 transition-all duration-150 ease-in-out",
        "border-primary/20 hover:border-primary/40 bg-background/80 backdrop-blur-sm",
        "shadow-sm hover:shadow-md"
      )}
    >
      <div className="relative h-4 w-4 overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out",
            isDark
              ? "scale-0 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          )}
        />

        {/* Moon Icon */}
        <Moon
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-500 ease-in-out",
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          )}
        />
      </div>

      {/* Animated background circle */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-full transition-all duration-300 ease-in-out",
          isDark
            ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10"
            : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
        )}
      />

      <span className="sr-only">
        Toggle theme to {isDark ? "light" : "dark"} mode
      </span>
    </Button>
  );
}
