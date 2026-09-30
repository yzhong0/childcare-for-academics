import Link from "next/link";

export function ThemeBadge({
  theme,
  link = true,
}: {
  theme: { id: string; label: string; color: string };
  link?: boolean;
}) {
  const cls = `inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.color}`;
  if (!link) return <span className={cls}>{theme.label}</span>;
  return (
    <Link href={`/sharings?theme=${theme.id}`} className={`${cls} hover:opacity-80`}>
      {theme.label}
    </Link>
  );
}
