import "./DailyBriefingHero.css";

type DailyBriefingHeroProps = {
  greeting: string;
  statusLines: Array<{ id: string; text: string }>;
};

export function DailyBriefingHero({ greeting, statusLines }: DailyBriefingHeroProps) {
  return (
    <header className="daily-briefing-hero" aria-labelledby="daily-briefing-heading">
      <p className="daily-briefing-hero__eyebrow">Today</p>
      <h1 className="daily-briefing-hero__greeting" id="daily-briefing-heading">
        {greeting}
      </h1>
      <p className="daily-briefing-hero__lead">
        Here’s a calm view of what matters for your business right now.
      </p>
      <ul className="daily-briefing-hero__status" aria-label="Today’s status">
        {statusLines.map((line) => (
          <li key={line.id}>{line.text}</li>
        ))}
      </ul>
    </header>
  );
}
