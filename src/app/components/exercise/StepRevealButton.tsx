"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";

interface StepRevealButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "warning";
}

export function StepRevealButton({
  href,
  children,
  variant = "primary",
}: StepRevealButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => router.push(href, { scroll: false })}
    >
      {children}
    </Button>
  );
}
