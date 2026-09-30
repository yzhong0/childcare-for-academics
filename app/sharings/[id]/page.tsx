import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { publicDisplayName } from "@/lib/display";
import { topicsForSharing } from "@/lib/themes";
import { QUESTIONS, SHORT_LABELS } from "@/lib/questions";
import { ThemeBadge } from "@/components/ThemeBadge";
import { CommentForm } from "@/components/CommentForm";

export const dynamic = "force-dynamic";

export default async function SharingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sharingId = Number(id);
  if (!Number.isInteger(sharingId)) notFound();

  const sharing = await prisma.sharing.findUnique({
    where: { id: sharingId },
    include: {
      comments: { where: { hidden: false }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!sharing || sharing.hidden) notFound();

  const themes = topicsForSharing(sharing);
  const answers: { key: keyof typeof SHORT_LABELS; question: string; value: string | null }[] = [
    { key: "q1", question: QUESTIONS.q1, value: sharing.q1Solutions },
    {
      key: "q2",
      question: QUESTIONS.q2,
      value:
        sharing.q2MultipleWaitlists === null
          ? null
          : sharing.q2MultipleWaitlists
            ? "Yes"
            : "No",
    },
    { key: "q3", question: QUESTIONS.q3, value: sharing.q3Challenges },
    { key: "q4", question: QUESTIONS.q4, value: sharing.q4OneChange },
    { key: "q5", question: QUESTIONS.q5, value: sharing.q5Insights },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/sharings" className="text-sm text-amber-700 hover:underline">
          ← All sharings
        </Link>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
            {publicDisplayName(sharing.displayName, sharing.source)}
            {sharing.country ? (
              <span className="ml-2 text-base font-normal text-stone-500">({sharing.country})</span>
            ) : null}
          </h1>
          <span className="text-sm text-stone-400">
            {sharing.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <ThemeBadge key={t.id} theme={t} />
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {answers.map(
          (a) =>
            a.value && (
              <section key={a.key} className="rounded-xl border border-stone-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-stone-900">{SHORT_LABELS[a.key]}</h2>
                <p className="mt-0.5 text-xs leading-relaxed text-stone-400">{a.question}</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-700">
                  {a.value}
                </p>
              </section>
            ),
        )}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">
          Discussion ({sharing.comments.length})
        </h2>
        <div className="mt-4 space-y-4">
          {sharing.comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-stone-900">{c.displayName}</span>
                <span className="text-xs text-stone-400">
                  {c.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                {c.body}
              </p>
            </div>
          ))}
          {sharing.comments.length === 0 && (
            <p className="text-sm text-stone-500">No comments yet. Start the discussion below.</p>
          )}
        </div>
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-stone-900">Join the discussion</h3>
          <CommentForm sharingId={sharing.id} />
        </div>
      </section>
    </div>
  );
}
