export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gradient-to-b from-secondary/40 to-secondary/70">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
        <span className="font-heading font-semibold uppercase tracking-wide text-foreground/80">
          Studentska Košarkaška Liga
        </span>
        <span className="mx-2 text-border">•</span>©{new Date().getFullYear()} · Napravljeno za
        studente, od studenata.
      </div>
    </footer>
  );
}
