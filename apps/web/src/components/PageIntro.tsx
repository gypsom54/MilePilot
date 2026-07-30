import type { ReactNode } from "react";
import "./PageIntro.css";

type PageIntroProps = {
  eyebrow?: string;
  title: string;
  description: ReactNode;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <header className="page-intro">
      {eyebrow ? <p className="page-intro__eyebrow">{eyebrow}</p> : null}
      <h1 className="page-intro__title">{title}</h1>
      <div className="page-intro__description">{description}</div>
    </header>
  );
}
