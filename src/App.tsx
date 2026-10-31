import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Recognize } from "./pages/Recognize";
import { ResultPage } from "./pages/Result";
import { History } from "./pages/History";
import { About } from "./pages/About";
import { ExploreCattle } from "./pages/ExploreCattle";
import { BreedComparison } from "./pages/BreedComparison";
import { FarmerInfo } from "./pages/FarmerInfo";
import { LanguageProvider } from "./context/LanguageContext";

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/recognize" element={<Recognize />} />
            <Route path="/explore" element={<ExploreCattle />} />
            <Route path="/compare" element={<BreedComparison />} />
            <Route path="/farmer-info" element={<FarmerInfo />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;
