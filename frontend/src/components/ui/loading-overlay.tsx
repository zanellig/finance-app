"use client";

import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  className?: string;
}

export function LoadingOverlay({ isLoading, className }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-muted-foreground">Processing...</p>
      </div>
    </div>
  );
}