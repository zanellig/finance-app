"use client";

import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.ComponentProps<"input"> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, error, type, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            type={inputType}
            className={cn(
              "h-11",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "border-destructive focus-visible:border-destructive",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

interface AuthFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function AuthForm({ children, onSubmit, className }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      {children}
    </form>
  );
}

interface AuthSubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function AuthSubmitButton({
  loading,
  disabled,
  children,
  loadingText = "Loading...",
}: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all transform hover:scale-[1.02] disabled:transform-none"
      disabled={loading || disabled}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}