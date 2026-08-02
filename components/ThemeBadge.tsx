import Link from "next/link";
import type { Theme } from "@/lib/themes";

export function ThemeBadge({ theme, link = true }: { theme: Theme; link?: boolean }) {
  const cls = `inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.color}`;
  if (!link) return <span className={cls}>{theme.label}</span>;
  return (
    <Link href={`/sharings?theme=${theme.id}`} className={`${cls} hover:opacity-80`}>
      {theme.label}
    </Link>
  );
}
