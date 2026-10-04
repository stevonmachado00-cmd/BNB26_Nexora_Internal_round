import React, { useState, useEffect } from "react";
import { LearnerProfile } from "./types";
import { learnerService } from "./services/learnerService";
import { storageService } from "./services/storageService";
import { Navbar } from "./components/navigation/Navbar";

// Streamlined Views
import { HeroSection } from "./pages/HeroSection";
import { MainDashboard } from "./pages/MainDashboard";
import { LearningDashboard } from "./pages/LearningDashboard";
import { ProfileSection } from "./pages/ProfileSection";
import { SettingsSection } from "./pages/SettingsSection";

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) return hash;
      if (window.location.pathname && window.location.pathname !== "/") {
        return window.location.pathname;
      }
    }
    return "/";
  });
  const [learner, setLearner] = useState<LearnerProfile>(learnerService.getCurrentLearner());

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace("#", "");
      setCurrentPath(hash || window.location.pathname || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const refreshState = () => {
    setLearner(learnerService.getCurrentLearner());
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetData = () => {
    if (window.confirm("Reset all local learning progress and restore baseline data?")) {
      storageService.resetAll();
      refreshState();
      handleNavigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-accent-foreground flex flex-col">
      {/* Sleek Top Navigation Bar (Hidden on /learn workbench where TitleBar provides native IDE nav) */}
      {currentPath !== "/learn" && (
        <Navbar
          currentPath={currentPath}
          onNavigate={handleNavigate}
          learner={learner}
        />
      )}

      {/* Main Content Viewport */}
      <main className={currentPath === "/learn" ? "h-screen w-screen overflow-hidden" : "flex-1"}>
        {currentPath === "/" && (
          <HeroSection
            onStartLearning={() => handleNavigate("/learn")}
            onGoToDashboard={() => handleNavigate("/dashboard")}
          />
        )}

        {currentPath === "/dashboard" && (
          <MainDashboard
            learner={learner}
            onStartLesson={(conceptId = "variables") => {
              window.history.pushState({}, "", `/learn?topic=${encodeURIComponent(conceptId)}`);
              setCurrentPath("/learn");
            }}
          />
        )}

        {currentPath === "/learn" && (
          <LearningDashboard
            conceptId={new URLSearchParams(window.location.search).get("topic") || "variables"}
            currentPath={currentPath}
            onNavigate={handleNavigate}
            onMoveForward={() => {
              // Advance learner mastery upon finishing lesson
              learnerService.resolveMisconception("return-vs-print");
              refreshState();
              handleNavigate("/dashboard");
            }}
          />
        )}

        {currentPath === "/profile" && (
          <ProfileSection learner={learner} />
        )}

        {currentPath === "/settings" && (
          <SettingsSection onResetData={handleResetData} />
        )}
      </main>
    </div>
  );
}
