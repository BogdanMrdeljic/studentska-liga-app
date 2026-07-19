"use client";

import { Button } from "@/components/ui/button";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Da li si siguran/na da želiš da obrišeš ovo?")) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive" size="sm">
        Obriši
      </Button>
    </form>
  );
}
