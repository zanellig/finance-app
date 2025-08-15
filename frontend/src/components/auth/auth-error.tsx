"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AuthErrorProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function AuthError({ error, onRetry, onDismiss }: AuthErrorProps) {
  return (
    <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1">{error}</span>
        <div className="flex gap-2 ml-4">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-7 px-3 text-xs border-destructive/20 hover:bg-destructive/10"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-7 px-2 text-xs hover:bg-destructive/10"
            >
              ×
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}