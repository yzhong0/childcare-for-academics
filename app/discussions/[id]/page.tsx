import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReplyForm } from "@/components/ReplyForm";

export const dynamic = "force-dynamic";

function ContactLine({ email }: { email: string | null }) {
  if (!email) return null;
  return (
    <p className="mt-2 text-xs text-stone-500">
      Open to being contacted:{" "}
      <a href={`mailto:${email}`} className="text-amber-700 hover:underline">
        {email}
      </a>
    </p>
  );
}

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const discussionId = Number(id);
  if (!Number.isInteger(discussionId)) notFound();

  const discussion = await prisma.discussion.findUnique({
    where: { id: discussionId },
    include: {
      replies: { where: { hidden: false }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!discussion || discussion.hidden) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/discussions" className="text-sm text-amber-700 hover:underline">
          ← All discussions
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
          {discussion.title}
        </h1>
        <p className="mt-1 text-xs text-stone-400">
          {discussion.displayName} ·{" "}
          {discussion.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="whitespace-pre-line text-sm leading-relaxed text-stone-700">
          {discussion.body}
        </p>
        <ContactLine email={discussion.contactEmail} />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">
          Replies ({discussion.replies.length})
        </h2>
        <div className="mt-4 space-y-4">
          {discussion.replies.map((r) => (
            <div key={r.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-stone-900">{r.displayName}</span>
                <span className="text-xs text-stone-400">
                  {r.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                {r.body}
              </p>
              <ContactLine email={r.contactEmail} />
            </div>
          ))}
          {discussion.replies.length === 0 && (
            <p className="text-sm text-stone-500">
              No replies yet. Share your thoughts below to get the conversation going.
            </p>
          )}
        </div>
        <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold text-stone-900">Reply to this discussion</h3>
          <ReplyForm discussionId={discussion.id} />
        </div>
      </section>
    </div>
  );
}
