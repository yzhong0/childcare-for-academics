import { CLOUD_HEIGHT, CLOUD_WIDTH, type CloudWord } from "@/lib/wordcloud";

export function WordCloud({ words }: { words: CloudWord[] }) {
  if (words.length === 0) return null;
  return (
    <div className="overflow-hidden rounded-2xl bg-[#1c1c20]">
      <svg
        viewBox={`0 0 ${CLOUD_WIDTH} ${CLOUD_HEIGHT}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Word cloud of the topics families mention most"
      >
        {words.map((word) => (
          <a key={word.text} href={word.href}>
            <text
              x={word.x}
              y={word.y}
              fontSize={word.size}
              fill={word.color}
              fontWeight={600}
              textAnchor="middle"
              dominantBaseline="central"
              className="cursor-pointer hover:opacity-80"
            >
              {word.text}
            </text>
          </a>
        ))}
      </svg>
    </div>
  );
}
