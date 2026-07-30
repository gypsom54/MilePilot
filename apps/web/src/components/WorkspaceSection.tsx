import type { ReactNode } from "react";
import "./WorkspaceSection.css";

type WorkspaceSectionProps = {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function WorkspaceSection({
  id,
  title,
  description,
  children,
}: WorkspaceSectionProps) {
  return (
    <section className="workspace-section" id={id} aria-labelledby={`${id}-heading`}>
      <div className="workspace-section__intro">
        <h2 id={`${id}-heading`}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="workspace-section__body">{children}</div>
    </section>
  );
}
