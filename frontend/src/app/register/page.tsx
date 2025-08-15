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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator";
import { zxcvbn } from "@zxcvbn-ts/core";
import { zxcvbnOptions } from "@zxcvbn-ts/core";
import { dictionary, adjacencyGraphs } from "@zxcvbn-ts/language-common";

// Initialize zxcvbn
const options = {
  dictionary: {
    ...dictionary,
  },
  graphs: adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { register, user } = useAuth();
  const router = useRouter();

  // Password validation rules
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    return errors;
  };

  // Password strength validation using zxcvbn
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, isAcceptable: false };
    const result = zxcvbn(password);
    // Require at least score of 2 (somewhat guessable) for registration
    return { score: result.score, isAcceptable: result.score >= 2 };
  };

  // Update password validation on password change
  useEffect(() => {
    if (password) {
      setPasswordErrors(validatePassword(password));
    } else {
      setPasswordErrors([]);
    }
  }, [password]);

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

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordErrors.length > 0) {
      setError("Please fix password requirements");
      setLoading(false);
      return;
    }

    // Check password strength
    const passwordStrength = getPasswordStrength(password);
    if (!passwordStrength.isAcceptable) {
      setError("Password is too weak. Please choose a stronger password.");
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
  };

  if (user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="h-screen flex auth-page overflow-hidden">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
        <div className="w-full max-w-sm space-y-3 my-auto">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl mb-3 mx-auto">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Creá tu cuenta
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Emprendé tu viaje hacia una mejor gestión financiera
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-4 sm:pt-5 pb-4 sm:pb-5">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-sm">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Name Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-9 sm:h-10"
                      required
                    />
                  </div>
                </div>

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
                      className="pl-10 h-9 sm:h-10"
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
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-9 sm:h-10"
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <PasswordStrengthIndicator password={password} />
                  )}

                  {/* Password Requirements */}
                  {password && (
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {["8+ chars", "Uppercase", "Lowercase", "Number"].map(
                        (rule, index) => {
                          const fullRule = [
                            "At least 8 characters",
                            "One uppercase letter",
                            "One lowercase letter",
                            "One number",
                          ][index];
                          const isValid = !passwordErrors.includes(fullRule);
                          return (
                            <div
                              key={rule}
                              className={`flex items-center space-x-1 ${
                                isValid
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {isValid ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                              <span className="text-xs">{rule}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-9 sm:h-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword && (
                    <div
                      className={`flex items-center space-x-2 text-xs ${
                        password === confirmPassword
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {password === confirmPassword ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      <span>
                        {password === confirmPassword ? "Match" : "No match"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked as boolean)
                    }
                    className="mt-0.5"
                  />
                  <div className="text-xs sm:text-sm leading-4">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary hover:text-primary/80 underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-9 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all transform hover:scale-[1.02] disabled:transform-none"
                  disabled={
                    loading ||
                    passwordErrors.length > 0 ||
                    !getPasswordStrength(password).isAcceptable ||
                    (password !== confirmPassword && confirmPassword !== "")
                  }
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm">Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-sm sm:text-base">
                      Create account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-3 sm:my-4">
                <Separator className="relative">
                  <span className="bg-card px-2 text-xs text-muted-foreground absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    Already have an account?
                  </span>
                </Separator>
              </div>

              {/* Sign in link */}
              <div className="text-center">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full h-9 sm:h-10 font-medium text-sm sm:text-base"
                  >
                    Sign in instead
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Illustration/Background */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20),transparent_70%)]" />

        {/* Floating elements */}
        <div className="relative w-full flex items-center justify-center p-8">
          <div className="space-y-6 text-center max-w-sm">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                Tu futuro financiero comienza acá
              </h2>
              <p className="text-muted-foreground">
                Unite a la comunidad que está transformando sus finanzas
                personales.
              </p>
            </div>

            {/* Success metrics */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">10K+</div>
                <div className="text-xs text-muted-foreground">
                  Active users
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">$2M+</div>
                <div className="text-xs text-muted-foreground">
                  Money tracked
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">95%</div>
                <div className="text-xs text-muted-foreground">
                  User satisfaction
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-primary">4.9★</div>
                <div className="text-xs text-muted-foreground">App rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-16 w-28 h-28 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-16 w-20 h-20 bg-primary/15 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-primary/20 rounded-full blur-md animate-pulse delay-500" />
      </div>
    </div>
  );
}
