export function AmbientGlow() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__orb ambient__orb--one" />
      <div className="ambient__orb ambient__orb--two" />
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className={`ambient__particle ambient__particle--${i}`} />
      ))}
    </div>
  );
}
