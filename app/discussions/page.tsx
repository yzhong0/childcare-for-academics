import Link from "next/link";
import { prisma } from "@/lib/db";
import { DiscussionForm } from "@/components/DiscussionForm";

export const dynamic = "force-dynamic";

const TEAM_EMAILS = [
  { name: "Jun Li", email: "junwli@umich.edu" },
  { name: "Senthil Veeraraghavan", email: "senthilv@wharton.upenn.edu" },
  { name: "Yueyang Zhong", email: "yzhong@london.edu" },
];

function excerpt(text: string): string {
  return text.length > 200 ? text.slice(0, 200).trimEnd() + "…" : text;
}

export default async function DiscussionsPage() {
  const discussions = await prisma.discussion.findMany({
    where: { hidden: false },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { replies: { where: { hidden: false } } } } },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Discussion board</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          This board is a free space for everyone who cares about childcare: researchers,
          parents, providers, employers, and policymakers. Start a thread to float a research
          idea, brainstorm a study design, debate an operational fix or a policy proposal, or
          ask the community a question — and reply to build on each other&apos;s thinking.
          Everything here is anonymous by default: no account, no name required. If a
          conversation grows into something you want to take offline — a collaboration, a data
          partnership, a co-authored project — simply include a contact email in your post or
          reply. It will be displayed publicly next to your message, so share it only when you
          are ready to be reached. And if you would rather talk to the research team directly,
          feel free to email us:{" "}
          {TEAM_EMAILS.map((t, i) => (
            <span key={t.email}>
              <a href={`mailto:${t.email}`} className="text-amber-700 hover:underline">
                {t.name}
              </a>
              {i < TEAM_EMAILS.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-stone-900">Start a new discussion</h2>
        <DiscussionForm />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">
          Open discussions ({discussions.length})
        </h2>
        {discussions.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">
            No discussions yet. Be the first to start one above.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {discussions.map((d) => (
              <Link
                key={d.id}
                href={`/discussions/${d.id}`}
                className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-stone-900">{d.title}</h3>
                  <span className="text-xs text-stone-400">
                    {d.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{excerpt(d.body)}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-stone-400">
                  <span>{d.displayName}</span>
                  <span className="ml-auto">
                    {d._count.replies} repl{d._count.replies === 1 ? "y" : "ies"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
