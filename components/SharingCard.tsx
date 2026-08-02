import Link from "next/link";
import type { Sharing } from "@prisma/client";
import { tagSharing } from "@/lib/themes";
import { ThemeBadge } from "./ThemeBadge";

function excerpt(s: Sharing): string {
  const text = s.q3Challenges || s.q1Solutions || s.q4OneChange || s.q5Insights || "";
  return text.length > 240 ? text.slice(0, 240).trimEnd() + "…" : text;
}

export function SharingCard({
  sharing,
  commentCount,
}: {
  sharing: Sharing;
  commentCount: number;
}) {
  const themes = tagSharing(sharing);
  return (
    <Link
      href={`/sharings/${sharing.id}`}
      className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:border-amber-300 hover:shadow"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-medium text-stone-900">{sharing.displayName}</span>
        <span className="text-xs text-stone-400">
          {sharing.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{excerpt(sharing)}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {themes.slice(0, 4).map((t) => (
          <ThemeBadge key={t.id} theme={t} link={false} />
        ))}
        <span className="ml-auto text-xs text-stone-400">
          {commentCount} comment{commentCount === 1 ? "" : "s"}
        </span>
      </div>
    </Link>
  );
}
