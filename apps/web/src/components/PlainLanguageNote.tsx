import type { ReactNode } from "react";
import "./PlainLanguageNote.css";

type PlainLanguageNoteProps = {
  children: ReactNode;
};

export function PlainLanguageNote({ children }: PlainLanguageNoteProps) {
  return (
    <aside className="plain-language-note" aria-label="In plain English">
      <p className="plain-language-note__label">In plain English</p>
      <div className="plain-language-note__body">{children}</div>
    </aside>
  );
}
