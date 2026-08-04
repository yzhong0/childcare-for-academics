import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const prisma = new PrismaClient();
const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const renamed = await prisma.sharing.updateMany({
    where: { displayName: { startsWith: "Survey respondent" } },
    data: { displayName: "Anonymous" },
  });
  if (renamed.count > 0) {
    console.log(`renamed ${renamed.count} survey display names to Anonymous`);
  }

  const existing = await prisma.sharing.count({ where: { source: "survey" } });
  if (existing > 0) {
    console.log(`survey sharings already seeded (${existing}); skipping`);
    return;
  }
  const records = JSON.parse(readFileSync(join(here, "seed-data.json"), "utf-8"));
  // Spread synthetic timestamps over the two weeks before the survey close date
  // so the browse page does not show 55 posts with an identical time.
  const end = new Date("2026-07-26T12:00:00Z").getTime();
  const start = end - 14 * 24 * 3600 * 1000;
  let created = 0;
  for (const [i, r] of records.entries()) {
    await prisma.sharing.create({
      data: {
        displayName: r.displayName,
        q1Solutions: r.q1Solutions,
        q2MultipleWaitlists: r.q2MultipleWaitlists,
        q3Challenges: r.q3Challenges,
        q4OneChange: r.q4OneChange,
        q5Insights: r.q5Insights,
        source: "survey",
        createdAt: new Date(start + ((end - start) * i) / records.length),
      },
    });
    created++;
  }
  console.log(`seeded ${created} survey sharings`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
