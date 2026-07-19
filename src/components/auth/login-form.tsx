"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const justRegistered = searchParams.get("registered") === "1";
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    startTransition(async () => {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Pogrešan email ili lozinka.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {justRegistered && (
        <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          Nalog je kreiran, prijavi se.
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="ime@fakultet.rs" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Lozinka</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Prijavljivanje..." : "Prijavi se"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nemaš nalog?{" "}
        <Link href="/registracija" className="font-medium text-primary underline-offset-4 hover:underline">
          Registruj se
        </Link>
      </p>
    </form>
  );
}
