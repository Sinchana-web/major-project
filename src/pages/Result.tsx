import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PredictionResult } from "../types/prediction";
import { getPredictionHistory } from "../utils/storage";
import { ResultCard } from "../components/results/ResultCard";
import { EmptyState } from "../components/common/EmptyState";

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [latestResult, setLatestResult] = useState<PredictionResult | null>(
    null
  );

  useEffect(() => {
    const history = getPredictionHistory();
    if (history.length > 0) {
      setLatestResult(history[0]);
    }
  }, []);

  if (!latestResult) {
    return (
      <EmptyState
        title="No Result Available"
        description="Please upload an animal image first to generate a breed recognition result."
        actionText="Go to Breed Recognition"
        onAction={() => navigate("/recognize")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ResultCard
        result={latestResult}
        onResetScan={() => navigate("/recognize")}
      />
    </div>
  );
};
