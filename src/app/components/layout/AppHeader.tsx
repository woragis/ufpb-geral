import Link from "next/link";
import { ThemeToggle } from "@/app/components/theme/ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-semibold text-fg hover:text-primary transition-colors"
        >
          UFPB Study
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
