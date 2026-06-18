"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { DisciplinaId } from "@/core/domain/ids";
import { disciplinas, topicoSlugFromId } from "@/infrastructure/catalog/disciplines";

interface StudyNavProps {
  disciplinaId: DisciplinaId;
  topicoSlug?: string;
  subtopicoSlug?: string;
  dificuldade?: 1 | 2 | 3;
  showDifficulty?: boolean;
}

export function StudyNav({
  disciplinaId,
  topicoSlug,
  subtopicoSlug,
  dificuldade = 2,
  showDifficulty = false,
}: StudyNavProps) {
  const router = useRouter();

  const disciplina = disciplinas.find((d) => d.id === disciplinaId);
  const topicos = useMemo(
    () =>
      disciplina?.modulos.flatMap((m) =>
        m.topicos.filter((t) => t.status === "ativo"),
      ) ?? [],
    [disciplina],
  );

  const topico = topicos.find((t) => topicoSlugFromId(t.id) === topicoSlug);
  const subtopicos = topico?.subtopicos ?? [];

  function onDisciplinaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/${e.target.value}`);
  }

  function onTopicoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    if (!slug) return;
    router.push(`/${disciplinaId}/${slug}`);
  }

  function onSubtopicoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    if (!slug || !topicoSlug) return;
    router.push(`/${disciplinaId}/${topicoSlug}/${slug}?d=${dificuldade}`);
  }

  function onDificuldadeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const d = e.target.value;
    if (!topicoSlug || !subtopicoSlug) return;
    router.push(`/${disciplinaId}/${topicoSlug}/${subtopicoSlug}?d=${d}`);
  }

  const selectClass =
    "rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-fg outline-none focus:border-primary focus:ring-2 focus:ring-ring/30";

  return (
    <nav
      aria-label="Navegação de estudo"
      className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface-elevated/60 p-3"
    >
      <label className="flex flex-col gap-1 text-xs font-medium text-fg-muted">
        Matéria
        <select
          className={selectClass}
          value={disciplinaId}
          onChange={onDisciplinaChange}
        >
          {disciplinas.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-fg-muted">
        Tópico
        <select
          className={selectClass}
          value={topicoSlug ?? ""}
          onChange={onTopicoChange}
        >
          <option value="">Escolha…</option>
          {topicos.map((t) => (
            <option key={t.id} value={topicoSlugFromId(t.id)}>
              {t.nome}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-fg-muted">
        Subtópico
        <select
          className={selectClass}
          value={subtopicoSlug ?? ""}
          onChange={onSubtopicoChange}
          disabled={!topicoSlug || subtopicos.length === 0}
        >
          <option value="">
            {topicoSlug ? "Escolha…" : "Selecione o tópico"}
          </option>
          {subtopicos.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.nome}
            </option>
          ))}
        </select>
      </label>

      {showDifficulty ? (
        <label className="flex flex-col gap-1 text-xs font-medium text-fg-muted">
          Dificuldade
          <select
            className={selectClass}
            value={dificuldade}
            onChange={onDificuldadeChange}
          >
            <option value={1}>1 — Básico</option>
            <option value={2}>2 — Médio</option>
            <option value={3}>3 — Avançado</option>
          </select>
        </label>
      ) : null}

      {topicoSlug && !subtopicoSlug ? (
        <span className="text-xs text-fg-subtle self-center pb-1">
          ou escolha um card abaixo
        </span>
      ) : null}
    </nav>
  );
}
