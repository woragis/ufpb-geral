import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CURATED_SEEDS } from "@/infrastructure/engagement/curated-seeds";
import { exercisePath } from "@/infrastructure/engagement/seed-key";

const ENGAGEMENT_PATH = path.join(process.cwd(), "data", "engagement.json");

async function readEngagementCount(): Promise<number> {
  try {
    const raw = await fs.readFile(ENGAGEMENT_PATH, "utf-8");
    const data = JSON.parse(raw) as { seeds?: Record<string, unknown> };
    return Object.keys(data.seeds ?? {}).length;
  } catch {
    return 0;
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-xl font-semibold">Admin</h1>
        <p className="mt-2 text-zinc-600">
          Configure <code>ADMIN_TOKEN</code> no ambiente para habilitar o painel.
        </p>
      </main>
    );
  }

  if (token !== adminToken) {
    redirect("/");
  }

  const engagementCount = await readEngagementCount();

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Painel Admin</h1>
        <Link href="/" className="text-sm underline">
          Início
        </Link>
      </div>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold">Estatísticas</h2>
        <ul className="mt-2 text-sm text-zinc-700">
          <li>Seeds com engajamento registrado: {engagementCount}</li>
          <li>Seeds curadas no catálogo: {CURATED_SEEDS.length}</li>
        </ul>
      </section>

      <section className="mt-6 rounded-xl border p-4">
        <h2 className="font-semibold">Seeds curadas</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {CURATED_SEEDS.map((c) => (
            <li key={`${c.topicoId}-${c.seed}`} className="flex justify-between gap-4">
              <span>
                {c.label} — <code>{c.topicoId}</code>
              </span>
              <Link
                href={exercisePath(c.disciplinaId, c)}
                className="underline shrink-0"
              >
                Abrir
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
