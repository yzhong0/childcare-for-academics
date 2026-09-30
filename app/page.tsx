import Link from "next/link";
import { prisma } from "@/lib/db";
import { browseTopicStats, keywordsForTopic, themeQuotes } from "@/lib/themes";
import { wordCloud } from "@/lib/wordcloud";
import { ThemeBadge } from "@/components/ThemeBadge";
import { WordCloud } from "@/components/WordCloud";
import { SharingCard } from "@/components/SharingCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const sharings = await prisma.sharing.findMany({
    where: { hidden: false },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { comments: { where: { hidden: false } } } } },
  });
  const stats = browseTopicStats(sharings);
  const activeStats = stats.filter((t) => t.count > 0);
  const cloud = wordCloud(sharings);
  const recent = sharings.slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-amber-50 border border-amber-100 p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
          What is it really like to find childcare for working parents?
        </h1>
        <p className="mt-4 text-justify leading-relaxed text-stone-700">
          As many of us know firsthand, finding childcare solutions for working professionals can
          be surprisingly complex, and the challenges often extend well beyond cost. We are an
          operations management research team — Jun Li (Ross School of Business, University of
          Michigan), Senthil Veeraraghavan (the Wharton School, University of Pennsylvania), and
          Yueyang Zhong (London Business School) — exploring operational solutions to childcare
          policy challenges. This forum collects real experiences from working families: what
          solutions they used, what stood in their way, and what they would change.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/share"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Share your experience
          </Link>
          <Link
            href="/sharings"
            className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:border-amber-400"
          >
            Read {sharings.length} sharings
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">Major topics</h2>
        <p className="mt-1 text-sm text-stone-500">
          Select a word to read the sharings that mention it.
        </p>
        <div className="mt-4">
          <WordCloud words={cloud} />
        </div>
      </section>

      {activeStats.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-stone-900">In their own words</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(() => {
              // Pick a distinct sharing for each topic card, since one sharing
              // often matches several topics.
              const used = new Set<number>();
              return activeStats.slice(0, 3).map((t) => {
                const quote = themeQuotes(sharings, { keywords: keywordsForTopic(t) }, 10).find(
                  (q) => !used.has(q.id),
                );
                if (!quote) return null;
                used.add(quote.id);
                return { theme: t, quote };
              });
            })().map((item) => {
              if (!item) return null;
              const { theme: t, quote } = item;
              return (
                <figure
                  key={t.id}
                  className="rounded-xl border border-stone-200 bg-white p-5 flex flex-col gap-3"
                >
                  <ThemeBadge theme={t} />
                  <blockquote className="text-sm leading-relaxed text-stone-600">
                    “{quote.text}”
                  </blockquote>
                  <figcaption className="mt-auto text-xs text-stone-400">
                    <Link href={`/sharings/${quote.id}`} className="hover:text-amber-700">
                      Read the full sharing →
                    </Link>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-stone-900">Recent sharings</h2>
          <Link href="/sharings" className="text-sm text-amber-700 hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {recent.map((s) => (
            <SharingCard key={s.id} sharing={s} commentCount={s._count.comments} />
          ))}
        </div>
      </section>
    </div>
  );
}
