"use client";

import { useEffect, useRef } from "react";

/** Rola suavemente até o último passo visível após revelar (sem resetar scroll da página). */
export function StepScrollOnReveal({ stepOrdem }: { stepOrdem: number }) {
  const prev = useRef(stepOrdem);

  useEffect(() => {
    if (stepOrdem > prev.current && stepOrdem > 0) {
      requestAnimationFrame(() => {
        const el = document.getElementById(`step-${stepOrdem}`);
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
    prev.current = stepOrdem;
  }, [stepOrdem]);

  return null;
}
