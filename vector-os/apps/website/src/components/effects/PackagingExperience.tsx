'use client';

import Image from 'next/image';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { VECTOR_ASSETS } from '@/lib/vector-assets';
import { mapRange } from '@/lib/motion';

const STAGES = [
  { title: 'Closed Presentation', body: 'Matte navy box. Restrained Vector identity. Sealed for transit.' },
  { title: 'Lid Opens', body: 'Precision hinge reveals the interior with deliberate, unhurried motion.' },
  { title: 'Foam Insert', body: 'Laboratory-grade foam cradles every component with exacting fit.' },
  { title: 'Research Pen', body: 'Premium pen presentation — engineered for research environments.' },
  { title: 'QC Card', body: 'Batch documentation and quality control release at your fingertips.' },
  { title: 'Information Booklet', body: 'Complete compound documentation supplied with every order.' },
  { title: 'Hologram Seal', body: 'Authenticity hologram catches the light — verification you can trust.' },
  { title: 'The Vector System', body: 'Every element designed as one cohesive, premium presentation.' },
] as const;

function stageIndex(progress: number) {
  return Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));
}

export function PackagingExperience() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();
  const activeStage = stageIndex(progress);

  const lidLift = mapRange(progress, 0.08, 0.22, 0, 1);
  const foamReveal = mapRange(progress, 0.2, 0.32, 0, 1);
  const penRotate = mapRange(progress, 0.3, 0.42, 0, 1);
  const qcSlide = mapRange(progress, 0.4, 0.52, 0, 1);
  const bookletReveal = mapRange(progress, 0.5, 0.62, 0, 1);
  const hologramGlow = mapRange(progress, 0.58, 0.78, 0, 1);
  const settle = mapRange(progress, 0.75, 1, 0, 1);
  const closedOpacity = mapRange(progress, 0, 0.15, 1, 0);
  const systemOpacity = mapRange(progress, 0.1, 0.28, 0, 1);

  return (
    <section className="packaging-experience section--light" id="packaging" aria-labelledby="packaging-title">
      <div
        ref={ref}
        className="packaging-experience__scroll"
        style={{ '--scroll-progress': progress } as React.CSSProperties}
      >
        <div className="packaging-experience__sticky">
          <div className="packaging-experience__layout">
            <div className="packaging-experience__copy">
              <p className="section-eyebrow section-eyebrow--dark">The Vector System</p>
              <h2 id="packaging-title" className="section-headline section-headline--dark">
                Packaging That
                <br />
                Commands Respect.
              </h2>

              <div className="packaging-experience__stages" aria-live="polite">
                {STAGES.map((stage, index) => (
                  <div
                    key={stage.title}
                    className={`packaging-experience__stage-copy${index === activeStage ? ' packaging-experience__stage-copy--active' : ''}`}
                  >
                    <h3 className="packaging-experience__stage-title">{stage.title}</h3>
                    <p className="packaging-experience__stage-body">{stage.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`packaging-experience__stage${reducedMotion ? ' packaging-experience__stage--static' : ''}`}
              style={
                reducedMotion
                  ? undefined
                  : ({
                      '--lid-lift': lidLift,
                      '--foam-reveal': foamReveal,
                      '--pen-rotate': penRotate,
                      '--qc-slide': qcSlide,
                      '--booklet-reveal': bookletReveal,
                      '--hologram-glow': hologramGlow,
                      '--settle': settle,
                      '--closed-opacity': closedOpacity,
                      '--system-opacity': systemOpacity,
                    } as React.CSSProperties)
              }
            >
              <div className="packaging-experience__lighting" aria-hidden="true" />
              <div className="packaging-experience__shadow" aria-hidden="true" />

              <div className="packaging-experience__image packaging-experience__image--closed">
                <Image
                  src={VECTOR_ASSETS.hero}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="packaging-experience__photo"
                />
                <div className="packaging-experience__lid" aria-hidden="true" />
              </div>

              <div className="packaging-experience__image packaging-experience__image--open">
                <Image
                  src={VECTOR_ASSETS.packagingSystem}
                  alt="Vector Peptides complete packaging system"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="packaging-experience__photo"
                />
              </div>

              <div className="packaging-experience__foam" aria-hidden="true" />
              <div className="packaging-experience__pen" aria-hidden="true" />
              <div className="packaging-experience__qc" aria-hidden="true">
                <span>QC</span>
              </div>
              <div className="packaging-experience__booklet" aria-hidden="true" />
              <div className="packaging-experience__hologram" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
