import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { AnalysisProgressPage } from "./pages/AnalysisProgressPage";
import { AskPage } from "./pages/AskPage";
import { DiscoverySummaryPage } from "./pages/DiscoverySummaryPage";
import { FaqArticlePage } from "./pages/FaqArticlePage";
import { HomePage } from "./pages/HomePage";
import { LearningCentrePage } from "./pages/LearningCentrePage";
import { OpportunitiesPage } from "./pages/OpportunitiesPage";
import { OpportunityDetailPage } from "./pages/OpportunityDetailPage";
import { WorkspacePage } from "./pages/WorkspacePage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="learn" element={<LearningCentrePage />} />
        <Route path="learn/:slug" element={<FaqArticlePage />} />
        <Route path="discover" element={<AnalysisProgressPage />} />
        <Route path="discover/summary" element={<DiscoverySummaryPage />} />
        <Route path="workspace" element={<WorkspacePage />} />
        <Route path="ask" element={<AskPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="opportunities/:slug" element={<OpportunityDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
