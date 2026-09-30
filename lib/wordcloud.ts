import type { Sharing } from "@prisma/client";
import { sharingText } from "@/lib/themes";

/**
 * Words and phrases grouped by meaning. `patterns` are lower-case substrings
 * matched against each sharing; a sharing counts once per term.
 */
type CuratedTerm = {
  text: string;
  patterns: string[];
  themeId: string;
  /** Always the largest words in the cloud, regardless of raw counts. */
  major?: boolean;
};

const CURATED: CuratedTerm[] = [
  { text: "waiting list", patterns: ["waitlist", "wait-list", "wait list", "waiting list"], themeId: "waitlist-access", major: true },
  { text: "waiting time", patterns: ["waiting time", "wait time", "long wait"], themeId: "waitlist-access", major: true },
  { text: "availability", patterns: ["availab"], themeId: "waitlist-access", major: true },
  { text: "access", patterns: ["access"], themeId: "waitlist-access", major: true },
  { text: "affordability", patterns: ["afford"], themeId: "affordability" },
  { text: "cost", patterns: ["cost", "price", "pricey", "tuition"], themeId: "affordability" },
  { text: "expensive", patterns: ["expensive"], themeId: "affordability" },
  { text: "quality", patterns: ["quality"], themeId: "quality" },
  { text: "nanny", patterns: ["nanny", "nannies"], themeId: "informal" },
  { text: "work schedule", patterns: ["schedule"], themeId: "flexibility" },
  { text: "flexibility", patterns: ["flexib"], themeId: "flexibility" },
  { text: "employer", patterns: ["employer"], themeId: "employer" },
  { text: "university", patterns: ["university", "campus"], themeId: "employer" },
  { text: "backup care", patterns: ["backup", "back-up", "back up"], themeId: "backup" },
  { text: "emergency", patterns: ["emergency"], themeId: "backup" },
  { text: "location", patterns: ["location"], themeId: "location" },
  { text: "commute", patterns: ["commute", "drive", "drop off", "drop-off", "pick up", "pick-up"], themeId: "location" },
  { text: "spots", patterns: ["spot", "slot"], themeId: "waitlist-access" },
  { text: "policy", patterns: ["policy", "government", "public"], themeId: "policy" },
  { text: "grandparents", patterns: ["grandparent", "grandma", "grandpa", "in-laws"], themeId: "informal" },
  { text: "family support", patterns: ["family support", "family help", "parents help", "relative"], themeId: "informal" },
  { text: "sick days", patterns: ["sick"], themeId: "backup" },
];

/** Tokens that carry no topic on their own. */
const STOP = new Set(
  `the a an of to and in for on with that this is are was were be been being it its as at by from or
   not but if so we our they their them you your i my me have has had do did does can could would
   should will just also very more most than then there these those who what when where how which
   into about over after before out up down no yes all any some such only other own same too because
   used find good really both first during years year still even much many well made make makes
   like get got went going want wanted need needed think thought know knew things thing something
   way ways lot lots one two three able back been being since until while whether though although
   however never always often sometimes here now ever every each another around across between
   without within us she he her his him them it's don't didn't can't i'm we're wasn't weren't isn't
   aren't doesn't couldn't wouldn't there's that's you're they're ended took take taking put
   kids kid child children son daughter baby babies childcare child-care care daycare day-care
   daycares centre center centers centres option options issue issues challenge challenges
   biggest primary main major mentioned answered above below satisfied happy luckily lucky
   fortunate fortunately currently current process situation experience experiences pretty quite
   bit little long short high low better best worse worst hard difficult easy easier great
   important different several various sure also etc e.g i.e own work working works worked job
   time times months month weeks week days day hours hour years year old wait waiting waited
   waits family families wife husband partner help helpful helped feel felt start started enough
   especially least live lived living born finding found needs need overall provide provided
   cannot combination frequently getting having nearby outside place result stay stayed young
   amount becomes become change changed come comes coming cover covered free extremely limited
   challenging people adjusted adjust adjusting mean means meant given give gives seems seem
   probably certainly definitely already almost mostly often usually rather instead hence thus
   therefore otherwise anyway kind sort part parts point points fact case cases end ends must
   less liked using doing either example full away early send pick turns offers provides depend
   ensure additional affected area class closer willing members perspective didn doesn wasn
   isn aren couldn wouldn shouldn attend choice conference convenient covid disruption
   expenses lack jobs turns summer country professional`
    .split(/\s+/)
    .filter(Boolean),
);

type Weighted = { text: string; count: number; href: string };

export type CloudWord = {
  text: string;
  href: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

export const CLOUD_WIDTH = 1000;
export const CLOUD_HEIGHT = 480;

const BLUES = ["#7d84f4", "#8f95ff", "#6b72e6", "#9ea3ff"];
const CORALS = ["#ef776b", "#e86a5f", "#f5928a", "#e2645a"];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mentions(texts: string[], patterns: string[]): number {
  return texts.filter((text) => patterns.some((pattern) => text.includes(pattern))).length;
}

function tokenize(segment: string): string[] {
  return segment
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z'\- ]+/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[-']+|[-']+$/g, ""))
    .filter((w) => w.length >= 3);
}

/** Split on sentence and clause punctuation so phrases never straddle a break. */
function segments(text: string): string[] {
  return text.split(/[.!?;:,()\n\/]+/).filter((s) => s.trim().length > 0);
}

/** Frequent words and two-word phrases from the sharings themselves. */
function minedTerms(texts: string[], covered: string[], limit: number): Weighted[] {
  const uni = new Map<string, number>();
  const bi = new Map<string, number>();
  for (const text of texts) {
    const seenUni = new Set<string>();
    const seenBi = new Set<string>();
    for (const segment of segments(text)) {
      const tokens = tokenize(segment);
      for (let i = 0; i < tokens.length; i++) {
        const w = tokens[i];
        const wStop = STOP.has(w) || w.length < 4;
        if (!wStop && !covered.some((p) => w.includes(p))) seenUni.add(w);
        const next = tokens[i + 1];
        if (next && !STOP.has(w) && !STOP.has(next)) {
          const phrase = `${w} ${next}`;
          if (!covered.some((p) => phrase.includes(p))) seenBi.add(phrase);
        }
      }
    }
    for (const w of seenUni) uni.set(w, (uni.get(w) ?? 0) + 1);
    for (const p of seenBi) bi.set(p, (bi.get(p) ?? 0) + 1);
  }

  const phrases = [...bi.entries()].filter(([, c]) => c >= 3);
  const inPhrase = new Set(phrases.flatMap(([p]) => p.split(" ")));
  const singles = [...uni.entries()].filter(([w, c]) => c >= 4 && !(inPhrase.has(w) && c <= 5));

  return [...phrases, ...singles]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([text, count]) => ({ text, count, href: `/sharings?q=${encodeURIComponent(text)}` }));
}

function estimateBox(text: string, size: number) {
  return { w: text.length * size * 0.56 + size * 0.3, h: size * 0.98 };
}

function overlaps(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
) {
  return !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y);
}

/** Lays the words out on an Archimedean spiral so that none overlap. */
function layout(words: (Weighted & { major: boolean })[]): CloudWord[] {
  const rand = mulberry32(20260930);
  const counts = words.map((w) => w.count);
  const minC = Math.min(...counts);
  const maxC = Math.max(...counts);
  const majors = words.filter((w) => w.major).sort((a, b) => b.count - a.count);

  const sized = words.map((w) => {
    let size: number;
    if (w.major) {
      const rank = majors.indexOf(w);
      size = 72 - rank * 7;
    } else {
      const t = maxC === minC ? 0.5 : (w.count - minC) / (maxC - minC);
      size = 15 + Math.pow(t, 0.8) * 33;
    }
    return { ...w, size };
  });
  sized.sort((a, b) => b.size - a.size);

  const placed: { x: number; y: number; w: number; h: number }[] = [];
  const out: CloudWord[] = [];
  const cx = CLOUD_WIDTH / 2;
  const cy = CLOUD_HEIGHT / 2;
  let colorFlip = 0;

  for (const word of sized) {
    const box = estimateBox(word.text, word.size);
    const start = rand() * Math.PI * 2;
    const stretch = CLOUD_WIDTH / CLOUD_HEIGHT;
    let done = false;
    for (let step = 0; step < 6000 && !done; step++) {
      const r = step * 0.38;
      const angle = start + step * 0.25;
      const x = cx + Math.cos(angle) * r * stretch - box.w / 2;
      const y = cy + Math.sin(angle) * r - box.h / 2;
      if (x < 8 || y < 4 || x + box.w > CLOUD_WIDTH - 8 || y + box.h > CLOUD_HEIGHT - 4) continue;
      const rect = { x, y, w: box.w, h: box.h };
      if (placed.some((p) => overlaps(p, rect))) continue;
      placed.push(rect);
      const palette = colorFlip++ % 2 === 0 ? BLUES : CORALS;
      out.push({
        text: word.text,
        href: word.href,
        x: x + box.w / 2,
        y: y + box.h / 2,
        size: word.size,
        color: palette[Math.floor(rand() * palette.length)],
      });
      done = true;
    }
  }
  return out;
}

/** Topic words positioned for the home-page cloud. Waiting and access terms stay largest. */
export function wordCloud(sharings: Sharing[]): CloudWord[] {
  const texts = sharings.map(sharingText);
  const curated = CURATED.map((term) => ({
    text: term.text,
    count: mentions(texts, term.patterns),
    href: `/sharings?theme=${term.themeId}`,
    major: term.major ?? false,
  })).filter((term) => term.major || term.count > 0);

  const covered = CURATED.flatMap((t) => t.patterns);
  const mined = minedTerms(texts, covered, 58).map((w) => ({ ...w, major: false }));
  const seen = new Set(curated.map((c) => c.text));
  const extras = mined.filter((w) => !seen.has(w.text));

  return layout([...curated, ...extras]);
}
