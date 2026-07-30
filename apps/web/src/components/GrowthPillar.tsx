import "./GrowthPillar.css";

type GrowthPillarProps = {
  title: string;
  explanation: string;
};

export function GrowthPillar({ title, explanation }: GrowthPillarProps) {
  return (
    <article className="growth-pillar">
      <h3 className="growth-pillar__title">{title}</h3>
      <p className="growth-pillar__explanation">{explanation}</p>
    </article>
  );
}
