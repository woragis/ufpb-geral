"use client";

import { useEffect, useState } from "react";

interface ExamTimerProps {
  minutes: number;
  onExpire?: () => void;
}

export function ExamTimer({ minutes, onExpire }: ExamTimerProps) {
  const totalMs = minutes * 60 * 1000;
  const [remaining, setRemaining] = useState(totalMs);
  const [started] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - started;
      const left = Math.max(0, totalMs - elapsed);
      setRemaining(left);
      if (left === 0) onExpire?.();
    }, 1000);
    return () => clearInterval(id);
  }, [started, totalMs, onExpire]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const urgent = remaining < 5 * 60 * 1000;

  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm font-mono ${
        urgent
          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
          : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
      }`}
    >
      Modo prova — {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
