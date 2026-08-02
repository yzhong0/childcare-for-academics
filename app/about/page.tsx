import Link from "next/link";
import Image from "next/image";

const TEAM = [
  {
    name: "Jun Li",
    title: "Professor of Technology and Operations",
    school: "Stephen M. Ross School of Business, University of Michigan",
    email: "junwli@umich.edu",
    photo: "/team/jun-li.png",
    bio: "Jun Li is a Professor of Technology and Operations at the Stephen M. Ross School of Business, University of Michigan. She conducts research in revenue management and pricing, healthcare management, supply chain risks, corporate social responsibility, and public sector operations, and her current work centers on improving the wellbeing of children and young adults through better education and care. Her honors include the MSOM Young Scholar Prize, INFORMS revenue management and pricing awards, and Poets&Quants 40-Under-40 MBA Professors. She holds a PhD in Managerial Economics and Management Science from the Wharton School.",
  },
  {
    name: "Senthil Veeraraghavan",
    title: "Panasonic Professor of Manufacturing and Logistics",
    school: "The Wharton School, University of Pennsylvania",
    email: "senthilv@wharton.upenn.edu",
    photo: "/team/senthil-veeraraghavan.jpg",
    bio: "Senthil Veeraraghavan is the Panasonic Professor of Manufacturing and Logistics and Professor of Operations, Information and Decisions at the Wharton School, University of Pennsylvania. His research spans revenue management, marketplace design, queueing games, and global supply chains, and his work on quality-speed tradeoffs in services won the first-ever Best Paper in Operations award from Management Science. A recipient of multiple Wharton teaching excellence awards, he graduated from the Indian Institute of Technology, Bombay and received his PhD in Operations from Carnegie Mellon University.",
  },
  {
    name: "Yueyang Zhong",
    title: "Assistant Professor of Management Science and Operations",
    school: "London Business School",
    email: "yzhong@london.edu",
    photo: "/team/yueyang-zhong.jpg",
    bio: "Yueyang Zhong is an Assistant Professor of Management Science and Operations at London Business School. She is an expert in stochastic modelling and optimisation of human-centred service systems, with research on customer and server behaviour in congested service systems and data-driven decision-making under limited or evolving information. Her work spans behavioural queueing, online learning, and information and mechanism design in high-stakes settings such as education, maternal health, and mental health. She earned her PhD at the University of Chicago Booth School of Business.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900">About this forum</h1>

      <div className="space-y-4 text-sm leading-relaxed text-stone-700">
        <p>
          We are an operations management research team exploring operational solutions to
          childcare policy challenges: how waitlists work (and fail), how capacity is allocated,
          and which operational levers could make the system better for families and providers
          alike.
        </p>
        <p>
          Childcare shapes careers, families, and ultimately the institutions that academics
          serve, yet the day-to-day experience of finding and keeping care is rarely documented
          in a way that research or policy can build on. Our goal with this forum is to change
          that: to gather first-hand accounts from academic families, understand the operational
          frictions they face, and translate those insights into better childcare systems and
          policies. We began with a short five-question survey within the Manufacturing and
          Service Operations Management (MSOM) Society in summer 2026, and this forum opens that
          conversation to the wider community. Anyone can add their own experience using the same
          five questions, or comment on existing sharings.
        </p>
        <p>
          The <Link href="/" className="text-amber-700 hover:underline">Topics</Link> page
          summarizes the conversation in real time: every sharing is automatically tagged against
          categories such as affordability, waitlists, availability, quality, and location, and
          the summary updates as new sharings arrive.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">The research team</h2>
        <div className="mt-4 space-y-4">
          {TEAM.map((m) => (
            <div
              key={m.email}
              className="flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-5 sm:flex-row"
            >
              <Image
                src={m.photo}
                alt={`Portrait of ${m.name}`}
                width={112}
                height={140}
                className="h-35 w-28 shrink-0 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{m.name}</h3>
                <p className="text-xs text-stone-500">
                  {m.title}, {m.school}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{m.bio}</p>
                <p className="mt-2 text-xs">
                  <a href={`mailto:${m.email}`} className="text-amber-700 hover:underline">
                    {m.email}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-900">Interested in collaborating?</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          We welcome collaborations with researchers, childcare providers, employers, and
          policymakers. Start a thread on the{" "}
          <Link href="/discussions" className="text-amber-700 hover:underline">
            Discussion Board
          </Link>{" "}
          to float a research idea and brainstorm with the community, or email any team member
          directly.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-900">Privacy</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Sharings and comments are public. We do not require accounts, and display names are
          optional. The seeded survey responses were anonymized before publication: all
          identifying metadata (IP addresses, locations, timestamps, response identifiers) was
          removed, and respondents are labeled only as “Survey respondent #N.” If a sharing is
          yours and you would like it edited or removed, contact the research team.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-stone-900">How the topic summary works</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Each sharing’s free-text answers are matched against a curated dictionary of childcare
          topics (for example, “afford,” “tuition,” and “subsidy” map to{" "}
          <em>Affordability &amp; cost</em>). Topic percentages and representative quotes are
          recomputed from the live database on every visit, so the summary always reflects the
          current state of the conversation.
        </p>
      </div>
    </div>
  );
}
