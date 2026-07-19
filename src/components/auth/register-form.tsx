"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Ime i prezime</Label>
        <Input id="name" name="name" required placeholder="Marko Marković" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="ime@fakultet.rs" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Lozinka</Label>
        <Input id="password" name="password" type="password" required minLength={6} />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Kreiranje naloga..." : "Registruj se"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Već imaš nalog?{" "}
        <Link href="/prijava" className="font-medium text-primary underline-offset-4 hover:underline">
          Prijavi se
        </Link>
      </p>
    </form>
  );
}
