import type { Sharing } from "@prisma/client";

export type Theme = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  color: string; // Tailwind classes for the badge
  bar: string; // Tailwind class for the dashboard bar
};

// Keyword dictionary curated from a read of the survey responses. Matching is
// case-insensitive substring matching on the combined free-text answers, so
// keep keywords as stems ("afford" matches affordable/affordability).
export const THEMES: Theme[] = [
  {
    id: "affordability",
    label: "Affordability & cost",
    description: "Tuition levels, fees, subsidies, and the financial burden of care.",
    keywords: [
      "afford", "cost", "expensive", "price", "tuition", "fee", "cheap",
      "subsid", "tax", "salary", "income", "pay", "budget", "money",
    ],
    color: "bg-rose-100 text-rose-800",
    bar: "bg-rose-400",
  },
  {
    id: "waiting",
    label: "Waitlists & waiting times",
    description: "Long queues, multiple waitlists, and uncertainty about when a spot opens.",
    keywords: [
      "wait", "waitlist", "wait-list", "wait list", "queue", "months to get",
      "list", "sign up early", "signed up", "registered before",
    ],
    color: "bg-amber-100 text-amber-800",
    bar: "bg-amber-400",
  },
  {
    id: "availability",
    label: "Availability & access",
    description: "Shortage of spots and difficulty finding any option at all.",
    keywords: [
      "availab", "access", "shortage", "spot", "slot", "no option", "options",
      "hard to find", "scarce", "desert", "supply", "capacity", "full",
    ],
    color: "bg-sky-100 text-sky-800",
    bar: "bg-sky-400",
  },
  {
    id: "quality",
    label: "Quality & trust",
    description: "Caregiver quality, staff turnover, safety, and trust in providers.",
    keywords: [
      "quality", "staff", "teacher", "caregiver", "turnover", "ratio",
      "trust", "safe", "curriculum", "development", "training", "care quality",
    ],
    color: "bg-emerald-100 text-emerald-800",
    bar: "bg-emerald-400",
  },
  {
    id: "location",
    label: "Location & commute",
    description: "Distance to providers, commutes, and drop-off/pick-up logistics.",
    keywords: [
      "location", "distance", "commute", "drive", "detour", "close to",
      "near", "far", "drop off", "drop-off", "pick up", "pick-up", "transport",
    ],
    color: "bg-violet-100 text-violet-800",
    bar: "bg-violet-400",
  },
  {
    id: "employer",
    label: "Employer & university support",
    description: "On-site care, campus care, and support (or lack of it) from employers.",
    keywords: [
      "employer", "university", "uni support", "campus", "company", "on-site",
      "onsite", "on site", "workplace", "job", "hr ", "benefit",
    ],
    color: "bg-indigo-100 text-indigo-800",
    bar: "bg-indigo-400",
  },
  {
    id: "flexibility",
    label: "Work schedule & flexibility",
    description: "Adjusted schedules, flexible hours, and the career impact of care gaps.",
    keywords: [
      "schedule", "flexib", "hours", "part-time", "part time", "shift",
      "remote", "work from home", "career", "productivity", "leave",
    ],
    color: "bg-teal-100 text-teal-800",
    bar: "bg-teal-400",
  },
  {
    id: "informal",
    label: "Nanny & family care",
    description: "Nannies, grandparents, relatives, and other informal arrangements.",
    keywords: [
      "nanny", "nannies", "grandparent", "grandma", "grandpa", "family support",
      "relative", "au pair", "babysit", "helper", "housekeeper", "in-laws", "parents help",
    ],
    color: "bg-orange-100 text-orange-800",
    bar: "bg-orange-400",
  },
  {
    id: "policy",
    label: "Policy & government",
    description: "Public provision, regulation, tax treatment, and paid leave.",
    keywords: [
      "policy", "government", "public", "regulat", "paid leave", "parental leave",
      "state", "federal", "deduct", "voucher", "law", "reform",
    ],
    color: "bg-slate-200 text-slate-800",
    bar: "bg-slate-400",
  },
  {
    id: "backup",
    label: "Emergency & backup care",
    description: "Sick-day coverage, emergency backup, and last-minute gaps.",
    keywords: ["emergency", "backup", "back-up", "sick", "last minute", "last-minute"],
    color: "bg-fuchsia-100 text-fuchsia-800",
    bar: "bg-fuchsia-400",
  },
];

export function sharingText(s: Sharing): string {
  return [s.q1Solutions, s.q3Challenges, s.q4OneChange, s.q5Insights]
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase();
}

export function tagSharing(s: Sharing): Theme[] {
  const text = sharingText(s);
  return THEMES.filter((t) => t.keywords.some((k) => text.includes(k)));
}

/** Filters shown on Browse Sharings. Waitlists and availability are one topic. */
export type BrowseTopic = {
  id: string;
  label: string;
  description: string;
  color: string;
  themeIds: string[];
};

export const BROWSE_TOPICS: BrowseTopic[] = [
  {
    id: "affordability",
    label: "Affordability & cost",
    description: "Tuition levels, fees, subsidies, and the financial burden of care.",
    color: "bg-rose-100 text-rose-800",
    themeIds: ["affordability"],
  },
  {
    id: "waitlist-access",
    label: "Waitlist & access",
    description: "Waitlists, waiting time, availability, and whether a family can get a spot.",
    color: "bg-amber-100 text-amber-800",
    themeIds: ["waiting", "availability"],
  },
  {
    id: "quality",
    label: "Quality & trust",
    description: "Caregiver quality, staff turnover, safety, and trust in providers.",
    color: "bg-emerald-100 text-emerald-800",
    themeIds: ["quality"],
  },
  {
    id: "location",
    label: "Location & commute",
    description: "Distance to providers, commutes, and drop-off/pick-up logistics.",
    color: "bg-violet-100 text-violet-800",
    themeIds: ["location"],
  },
  {
    id: "employer",
    label: "Employer & university support",
    description: "On-site care, campus care, and support (or lack of it) from employers.",
    color: "bg-indigo-100 text-indigo-800",
    themeIds: ["employer"],
  },
  {
    id: "flexibility",
    label: "Work schedule & flexibility",
    description: "Adjusted schedules, flexible hours, and the career impact of care gaps.",
    color: "bg-teal-100 text-teal-800",
    themeIds: ["flexibility"],
  },
  {
    id: "informal",
    label: "Nanny & family care",
    description: "Nannies, grandparents, relatives, and other informal arrangements.",
    color: "bg-orange-100 text-orange-800",
    themeIds: ["informal"],
  },
  {
    id: "policy",
    label: "Policy & government",
    description: "Public provision, regulation, tax treatment, and paid leave.",
    color: "bg-slate-200 text-slate-800",
    themeIds: ["policy"],
  },
  {
    id: "backup",
    label: "Emergency & backup care",
    description: "Sick-day coverage, emergency backup, and last-minute gaps.",
    color: "bg-fuchsia-100 text-fuchsia-800",
    themeIds: ["backup"],
  },
];

const TOPIC_ALIASES: Record<string, string> = {
  waiting: "waitlist-access",
  availability: "waitlist-access",
};

export function resolveBrowseTopic(id: string | undefined): BrowseTopic | undefined {
  if (!id) return undefined;
  return BROWSE_TOPICS.find((t) => t.id === (TOPIC_ALIASES[id] ?? id));
}

export function keywordsForTopic(topic: BrowseTopic): string[] {
  const ids = new Set(topic.themeIds);
  return THEMES.filter((t) => ids.has(t.id)).flatMap((t) => t.keywords);
}

export function topicsForSharing(s: Sharing): BrowseTopic[] {
  const tagged = new Set(tagSharing(s).map((t) => t.id));
  return BROWSE_TOPICS.filter((topic) => topic.themeIds.some((id) => tagged.has(id)));
}

export function browseTopicStats(sharings: Sharing[]): (BrowseTopic & { count: number })[] {
  return BROWSE_TOPICS.map((topic) => ({
    ...topic,
    count: sharings.filter((s) => topicsForSharing(s).some((t) => t.id === topic.id)).length,
  })).sort((a, b) => b.count - a.count);
}

export type ThemeStat = Theme & { count: number; share: number };

export function themeStats(sharings: Sharing[]): ThemeStat[] {
  const n = Math.max(sharings.length, 1);
  const counts = new Map<string, number>(THEMES.map((t) => [t.id, 0]));
  for (const s of sharings) {
    for (const t of tagSharing(s)) counts.set(t.id, (counts.get(t.id) ?? 0) + 1);
  }
  return THEMES.map((t) => ({
    ...t,
    count: counts.get(t.id) ?? 0,
    share: (counts.get(t.id) ?? 0) / n,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Short representative excerpts for a theme, preferring challenge answers.
 * Pass `usedIds` to avoid repeating the same sharing across multiple themes;
 * matched sharing ids are added to it.
 */
export function themeQuotes(
  sharings: Sharing[],
  theme: { keywords: string[] },
  max = 3,
  usedIds?: Set<number>,
): { id: number; text: string }[] {
  const out: { id: number; text: string }[] = [];
  for (const s of sharings) {
    if (usedIds?.has(s.id)) continue;
    const fields = [s.q3Challenges, s.q4OneChange, s.q5Insights, s.q1Solutions];
    for (const f of fields) {
      if (!f) continue;
      const lower = f.toLowerCase();
      if (theme.keywords.some((k) => lower.includes(k)) && f.length >= 40 && f.length <= 320) {
        out.push({ id: s.id, text: f.trim() });
        usedIds?.add(s.id);
        break;
      }
    }
    if (out.length >= max) break;
  }
  return out;
}

/** One-sentence, data-driven summary of the current conversation. */
export function narrativeSummary(sharings: Sharing[]): string {
  if (sharings.length === 0) return "No sharings yet.";
  const stats = themeStats(sharings).filter((t) => t.count > 0);
  const top = stats.slice(0, 3);
  const answered = sharings.filter((s) => s.q2MultipleWaitlists !== null);
  const multi = answered.filter((s) => s.q2MultipleWaitlists === true).length;
  const pct = answered.length > 0 ? Math.round((100 * multi) / answered.length) : null;
  let text = `Across ${sharings.length} sharings, the most discussed themes are ${top
    .map((t) => `${t.label.toLowerCase()} (${t.count})`)
    .join(", ")}.`;
  if (pct !== null) {
    text += ` ${pct}% of families who answered said they joined multiple childcare waitlists while searching for care.`;
  }
  return text;
}
