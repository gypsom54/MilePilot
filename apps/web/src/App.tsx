import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { FaqArticlePage } from "./pages/FaqArticlePage";
import { HomePage } from "./pages/HomePage";
import { LearningCentrePage } from "./pages/LearningCentrePage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="learn" element={<LearningCentrePage />} />
        <Route path="learn/:slug" element={<FaqArticlePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
