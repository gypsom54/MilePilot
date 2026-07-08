import { FadeIn } from '@/components/effects/FadeIn';

export function PlatformPreview() {
  return (
    <section className="preview" aria-labelledby="preview-heading">
      <div className="preview__inner">
        <FadeIn>
          <div className="preview__header">
            <h2 id="preview-heading" className="preview__title">
              Designed for clarity
            </h2>
            <p className="preview__subtitle">
              A unified interface for research operations — clean, focused, and
              built to scale with your laboratory.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={150}>
          <div className="preview__frame">
            <div className="preview__frame-glow" aria-hidden="true" />
            <div className="preview__chrome" aria-hidden="true">
              <span className="preview__dot" />
              <span className="preview__dot" />
              <span className="preview__dot" />
            </div>

            <div className="preview__screen">
              <div className="preview__sidebar">
                <div className="preview__sidebar-logo" />
                <div className="preview__sidebar-item preview__sidebar-item--active" />
                <div className="preview__sidebar-item" />
                <div className="preview__sidebar-item" />
                <div className="preview__sidebar-item" />
              </div>

              <div className="preview__main">
                <div className="preview__toolbar">
                  <div className="preview__toolbar-title" />
                  <div className="preview__toolbar-action" />
                </div>

                <div className="preview__content">
                  <div className="preview__panel preview__panel--wide" />
                  <div className="preview__panel-row">
                    <div className="preview__panel" />
                    <div className="preview__panel" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
