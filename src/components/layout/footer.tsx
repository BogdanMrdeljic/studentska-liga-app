export function Footer() {
  return (
    <footer className="mt-auto border-t bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Studentska Košarkaška Liga. Napravljeno za studente, od studenata.
      </div>
    </footer>
  );
}
