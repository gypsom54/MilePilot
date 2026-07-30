import type { ReactNode } from "react";
import "./PageContainer.css";

type PageContainerProps = {
  children: ReactNode;
  narrow?: boolean;
};

export function PageContainer({ children, narrow = false }: PageContainerProps) {
  return (
    <div className={`page-container${narrow ? " page-container--narrow" : ""}`}>
      {children}
    </div>
  );
}
