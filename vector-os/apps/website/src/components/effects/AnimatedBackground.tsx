const PARTICLES = [
  { top: '8%', left: '12%', size: 3, duration: 22, delay: 0 },
  { top: '18%', left: '78%', size: 2, duration: 28, delay: 2 },
  { top: '32%', left: '45%', size: 2, duration: 24, delay: 4 },
  { top: '55%', left: '8%', size: 3, duration: 26, delay: 1 },
  { top: '68%', left: '88%', size: 2, duration: 30, delay: 3 },
  { top: '82%', left: '35%', size: 2, duration: 20, delay: 5 },
  { top: '42%', left: '92%', size: 3, duration: 25, delay: 2 },
  { top: '75%', left: '62%', size: 2, duration: 27, delay: 6 },
  { top: '12%', left: '55%', size: 2, duration: 23, delay: 1 },
  { top: '48%', left: '22%', size: 2, duration: 29, delay: 4 },
  { top: '90%', left: '72%', size: 3, duration: 21, delay: 0 },
  { top: '25%', left: '30%', size: 2, duration: 26, delay: 3 },
] as const;

export function AnimatedBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__gradient ambient__gradient--one" />
      <div className="ambient__gradient ambient__gradient--two" />
      <div className="ambient__gradient ambient__gradient--three" />
      <div className="ambient__mesh" />

      {PARTICLES.map((particle, index) => (
        <span
          key={index}
          className="ambient__particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
