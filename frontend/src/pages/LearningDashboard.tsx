import React, { useState } from "react";
import { Problem } from "../types";
import { Workbench } from "../components/workbench/Workbench";
import { learnerService } from "../services/learnerService";
import { ModuleIntroduction } from "./ModuleIntroduction";

interface LearningDashboardProps {
  conceptId?: string;
  onMoveForward?: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  conceptId = "functions",
  onMoveForward,
  onNavigate = (path: string) => {
    window.location.hash = path;
  },
  currentPath = "/learn",
}) => {
  const currentLearner = learnerService.getCurrentLearner();
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  if (!selectedProblem) {
    return <ModuleIntroduction topic={conceptId} onChooseQuestion={setSelectedProblem} />;
  }

  return (
    <Workbench
      key={selectedProblem.id}
      currentPath={currentPath}
      onNavigate={onNavigate}
      learner={currentLearner}
      conceptId={conceptId}
      onAdvanceLesson={onMoveForward}
      initialProblem={selectedProblem}
      onChooseAnotherQuestion={() => setSelectedProblem(null)}
    />
  );
};
