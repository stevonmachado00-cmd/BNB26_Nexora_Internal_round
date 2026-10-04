import { LearnerProfile, Misconception, TeachingStyle, LearningHistoryEvent } from "../types";
import { storageService } from "./storageService";

export const learnerService = {
  getCurrentLearner(): LearnerProfile {
    return storageService.getLearner();
  },

  updateLearner(updates: Partial<LearnerProfile>): LearnerProfile {
    const current = this.getCurrentLearner();
    const updated = { ...current, ...updates };
    storageService.saveLearner(updated);
    return updated;
  },

  resolveMisconception(misconceptionId: string): { learner: LearnerProfile; updatedMisconception: Misconception } {
    const misconceptions = storageService.getMisconceptions();
    const targetIdx = misconceptions.findIndex((m) => m.id === misconceptionId);
    let target = misconceptions[targetIdx];

    if (target) {
      target = {
        ...target,
        status: "resolved",
        resolvedCount: target.resolvedCount + 1,
        confidence: Math.min(98, target.confidence + 15),
      };
      misconceptions[targetIdx] = target;
      storageService.saveMisconceptions(misconceptions);
    }

    const current = this.getCurrentLearner();
    // Re:Learn increases level and mastery percentage based on true understanding
    const newMastery = Math.min(100, current.masteryPercentage + 3);
    const updatedSkills = current.skills.map((skill) => {
      if (skill.concept.toLowerCase().includes("function")) {
        return {
          ...skill,
          masteryPercentage: Math.min(100, skill.masteryPercentage + 14),
          status: "proficient" as const,
          trend: "+14%" as const,
        };
      }
      return skill;
    });

    const updatedLearner: LearnerProfile = {
      ...current,
      masteryPercentage: newMastery,
      masteryProgressToNextLevel: Math.min(100, current.masteryProgressToNextLevel + 20),
      misconceptionsResolved: current.misconceptionsResolved + 1,
      activeMisconceptionsCount: Math.max(0, current.activeMisconceptionsCount - 1),
      skills: updatedSkills,
    };

    storageService.saveLearner(updatedLearner);

    // Add to learning timeline
    const historyEvents = storageService.getHistoryEvents();
    const newEvent: LearningHistoryEvent = {
      id: "event-" + Date.now(),
      date: "Just now",
      type: "misconception_resolved",
      title: `${target ? target.name : "Misconception"} Resolved`,
      detail: `Verified via 2 transfer challenges and delayed memory check. Mastery boosted to ${newMastery}%.`,
      relatedConcept: target ? target.relatedConcept : "Python Fundamentals",
    };
    storageService.saveHistoryEvents([newEvent, ...historyEvents]);

    return { learner: updatedLearner, updatedMisconception: target };
  },

  recordMisconceptionEncounter(misconceptionId: string): void {
    const misconceptions = storageService.getMisconceptions();
    const targetIdx = misconceptions.findIndex((m) => m.id === misconceptionId);
    if (targetIdx >= 0) {
      const target = misconceptions[targetIdx];
      misconceptions[targetIdx] = {
        ...target,
        occurrenceCount: target.occurrenceCount + 1,
        lastEncountered: "Just now",
      };
      storageService.saveMisconceptions(misconceptions);
    }
  },

  setPreferredTeachingStyle(style: TeachingStyle): void {
    const label =
      style === "contrast-examples"
        ? "Contrast examples"
        : style === "visual-trace"
        ? "Visual execution trace"
        : "Step-by-step walkthrough";
    this.updateLearner({ effectiveTeachingStyle: label });
  },

  resetDemoProgress(): void {
    storageService.resetAll();
  },
};
