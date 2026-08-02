import Link from "next/link";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import {
  adminDeleteComment,
  adminDeleteDiscussion,
  adminDeleteReply,
  adminDeleteSharing,
  adminLogout,
  adminToggleComment,
  adminToggleDiscussion,
  adminToggleReply,
  adminToggleSharing,
} from "@/app/actions";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const dynamic = "force-dynamic";

const btnCls =
  "rounded-md border border-stone-300 bg-white px-2.5 py-1 text-xs text-stone-600 hover:border-amber-400";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Moderation</h1>
        <p className="text-sm text-stone-600">
          This page is for the research team. Enter the admin password to manage sharings and
          comments.
        </p>
        <AdminLoginForm />
      </div>
    );
  }

  const sharings = await prisma.sharing.findMany({
    orderBy: { createdAt: "desc" },
    include: { comments: { orderBy: { createdAt: "asc" } } },
  });
  const hiddenCount = sharings.filter((s) => s.hidden).length;
  const discussions = await prisma.discussion.findMany({
    orderBy: { createdAt: "desc" },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Moderation</h1>
          <p className="mt-1 text-sm text-stone-500">
            {sharings.length} sharings ({hiddenCount} hidden). Hidden items disappear from the
            public site but stay in the database; delete is permanent.
          </p>
        </div>
        <form action={adminLogout}>
          <button type="submit" className={btnCls}>
            Log out
          </button>
        </form>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-stone-900">
          Discussion board ({discussions.length} discussions)
        </h2>
        {discussions.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No discussions yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {discussions.map((d) => (
              <div
                key={d.id}
                className={`rounded-lg border p-3 text-sm ${
                  d.hidden ? "border-rose-200 bg-rose-50/50" : "border-stone-200"
                }`}
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <Link
                    href={`/discussions/${d.id}`}
                    className="font-medium text-stone-900 hover:text-amber-700"
                  >
                    #{d.id} {d.title}
                  </Link>
                  <span className="text-xs text-stone-400">
                    {d.displayName} · {d.createdAt.toLocaleDateString("en-US")}
                    {d.hidden ? " · HIDDEN" : ""}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <form action={adminToggleDiscussion}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className={btnCls}>
                        {d.hidden ? "Unhide" : "Hide"}
                      </button>
                    </form>
                    <form action={adminDeleteDiscussion}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className={`${btnCls} text-rose-600`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-stone-600">{d.body}</p>
                {d.replies.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
                    {d.replies.map((r) => (
                      <div key={r.id} className="flex items-start gap-2 text-sm">
                        <span
                          className={`flex-1 ${r.hidden ? "text-rose-400 line-through" : "text-stone-600"}`}
                        >
                          <span className="font-medium text-stone-800">{r.displayName}:</span>{" "}
                          {r.body}
                        </span>
                        <form action={adminToggleReply}>
                          <input type="hidden" name="id" value={r.id} />
                          <button type="submit" className={btnCls}>
                            {r.hidden ? "Unhide" : "Hide"}
                          </button>
                        </form>
                        <form action={adminDeleteReply}>
                          <input type="hidden" name="id" value={r.id} />
                          <button type="submit" className={`${btnCls} text-rose-600`}>
                            Delete
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="space-y-4">
        {sharings.map((s) => (
          <div
            key={s.id}
            className={`rounded-xl border p-4 ${
              s.hidden ? "border-rose-200 bg-rose-50/50" : "border-stone-200 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/sharings/${s.id}`}
                className="font-medium text-stone-900 hover:text-amber-700"
              >
                #{s.id} {s.displayName}
              </Link>
              <span className="text-xs text-stone-400">
                {s.source} · {s.createdAt.toLocaleDateString("en-US")}
                {s.hidden ? " · HIDDEN" : ""}
              </span>
              <div className="ml-auto flex gap-2">
                <form action={adminToggleSharing}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className={btnCls}>
                    {s.hidden ? "Unhide" : "Hide"}
                  </button>
                </form>
                <form action={adminDeleteSharing}>
                  <input type="hidden" name="id" value={s.id} />
                  <button type="submit" className={`${btnCls} text-rose-600`}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-stone-600">
              {s.q3Challenges || s.q1Solutions || s.q4OneChange || s.q5Insights || "(no text)"}
            </p>
            {s.comments.length > 0 && (
              <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
                {s.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 text-sm">
                    <span
                      className={`flex-1 ${c.hidden ? "text-rose-400 line-through" : "text-stone-600"}`}
                    >
                      <span className="font-medium text-stone-800">{c.displayName}:</span> {c.body}
                    </span>
                    <form action={adminToggleComment}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className={btnCls}>
                        {c.hidden ? "Unhide" : "Hide"}
                      </button>
                    </form>
                    <form action={adminDeleteComment}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className={`${btnCls} text-rose-600`}>
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
