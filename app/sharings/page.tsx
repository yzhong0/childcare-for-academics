import Link from "next/link";
import { prisma } from "@/lib/db";
import { THEMES, sharingText, tagSharing } from "@/lib/themes";
import { SharingCard } from "@/components/SharingCard";

export const dynamic = "force-dynamic";

export default async function SharingsPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string; q?: string }>;
}) {
  const { theme: themeId, q } = await searchParams;
  const activeTheme = THEMES.find((t) => t.id === themeId);
  const query = (q ?? "").trim().toLowerCase();

  const all = await prisma.sharing.findMany({
    where: { hidden: false },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: { where: { hidden: false } } } } },
  });

  const filtered = all.filter((s) => {
    if (activeTheme && !tagSharing(s).some((t) => t.id === activeTheme.id)) return false;
    if (query && !sharingText(s).includes(query)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Sharings</h1>
        <p className="mt-1 text-sm text-stone-500">
          {filtered.length} of {all.length} sharings
          {activeTheme ? ` tagged “${activeTheme.label}”` : ""}
          {query ? ` matching “${query}”` : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/sharings"
          className={`rounded-full px-3 py-1 text-sm ${
            !activeTheme
              ? "bg-stone-800 text-white"
              : "bg-white border border-stone-300 text-stone-600 hover:border-amber-400"
          }`}
        >
          All themes
        </Link>
        {THEMES.map((t) => (
          <Link
            key={t.id}
            href={`/sharings?theme=${t.id}`}
            className={`rounded-full px-3 py-1 text-sm ${
              activeTheme?.id === t.id
                ? "bg-stone-800 text-white"
                : "bg-white border border-stone-300 text-stone-600 hover:border-amber-400"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <form className="flex gap-2" action="/sharings" method="get">
        {activeTheme && <input type="hidden" name="theme" value={activeTheme.id} />}
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search sharings…"
          className="w-full max-w-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm text-stone-700 hover:border-amber-400"
        >
          Search
        </button>
      </form>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
          No sharings match this filter yet.{" "}
          <Link href="/share" className="text-amber-700 hover:underline">
            Be the first to share your experience.
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((s) => (
            <SharingCard key={s.id} sharing={s} commentCount={s._count.comments} />
          ))}
        </div>
      )}
    </div>
  );
}
