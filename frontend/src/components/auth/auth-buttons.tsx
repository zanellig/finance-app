"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <Link href="/login">
      <Button variant={"default"}>Sign In</Button>
    </Link>
  );
}

export function SignUpButton() {
  return (
    <Link href="/register">
      <Button variant={"outline"}>Sign Up</Button>
    </Link>
  );
}

export function UserButton() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Hello, {user?.name}</span>
      <Button variant="outline" onClick={logout}>
        Sign Out
      </Button>
    </div>
  );
}

export function AuthButtons() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-sm">Loading...</div>;
  }

  return user ? (
    <UserButton />
  ) : (
    <>
      <SignInButton />
      <SignUpButton />
    </>
  );
}
