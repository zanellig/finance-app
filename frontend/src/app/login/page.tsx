"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="h-screen flex auth-page overflow-hidden">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
        <div className="w-full max-w-sm space-y-4 my-auto">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mb-3 mx-auto">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Ingresá a tu cuenta de Finar para continuar
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10 sm:h-11"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-10 sm:h-11"
                      required
                    />
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
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all transform hover:scale-[1.02] disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm">Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm sm:text-base">
                      Sign in
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-4 sm:my-6">
                <Separator className="relative">
                  <span className="bg-card px-2 text-xs text-muted-foreground absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    Don&apos;t have an account?
                  </span>
                </Separator>
              </div>

              {/* Sign up link */}
              <div className="text-center">
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full h-10 sm:h-11 font-medium text-sm sm:text-base"
                  >
                    Create an account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer - Hidden on small screens to save space */}
          <div className="hidden sm:block text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Illustration/Background */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20),transparent_70%)]" />

        {/* Floating elements */}
        <div className="relative w-full flex items-center justify-center p-8">
          <div className="space-y-6 text-center max-w-sm">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Take control of your finances
              </h2>
              <p className="text-muted-foreground">
                Track expenses, manage budgets, and achieve your financial goals
                with our powerful finance tracker.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Real-time expense tracking</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Smart budget management</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Insightful financial reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-16 right-16 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-16 left-16 w-16 h-16 bg-primary/15 rounded-full blur-lg animate-pulse delay-1000" />
      </div>
    </div>
  );
}
