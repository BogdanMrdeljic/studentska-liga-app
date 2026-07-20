import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrijavaPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4">
      <div className="relative mb-6 size-16 overflow-hidden rounded-full ring-2 ring-primary/20">
        <Image src="/logo.png" alt="Studentska Košarkaška Liga" fill sizes="64px" className="object-cover object-top" />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Prijava</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
