"use client";

export function MissionModeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="mission-mode-gradient absolute -left-1/4 top-0 h-[60vh] w-[70vw] rounded-full opacity-40 blur-[120px]" />
      <div className="mission-mode-gradient-alt absolute -right-1/4 bottom-0 h-[50vh] w-[60vw] rounded-full opacity-30 blur-[100px]" />
      <div className="mission-mode-orb absolute left-[20%] top-[30%] h-2 w-2 rounded-full opacity-60" />
      <div className="mission-mode-orb mission-mode-orb-delay-1 absolute right-[25%] top-[20%] h-1.5 w-1.5 rounded-full opacity-50" />
      <div className="mission-mode-orb mission-mode-orb-delay-2 absolute bottom-[35%] left-[40%] h-1 w-1 rounded-full opacity-40" />
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="mission-mode-particle absolute rounded-full"
          style={{
            left: `${(i * 17 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            animationDelay: `${i * 0.7}s`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}
