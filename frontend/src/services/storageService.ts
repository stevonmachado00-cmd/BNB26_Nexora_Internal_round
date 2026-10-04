import {
  LearnerProfile,
  Misconception,
  LearningHistoryEvent,
  ProblemHistoryRecord,
} from "../types";
import {
  INITIAL_LEARNER,
  MOCK_MISCONCEPTIONS,
  MOCK_HISTORY_EVENTS,
  MOCK_PROBLEM_HISTORY,
} from "../data/mockData";

const STORAGE_KEYS = {
  LEARNER: "relearn_learner_profile_v1",
  MISCONCEPTIONS: "relearn_misconceptions_v1",
  HISTORY_EVENTS: "relearn_history_events_v1",
  PROBLEM_HISTORY: "relearn_problem_history_v1",
};

export const storageService = {
  getLearner(): LearnerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNER);
      return data ? JSON.parse(data) : INITIAL_LEARNER;
    } catch {
      return INITIAL_LEARNER;
    }
  },

  saveLearner(learner: LearnerProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNER, JSON.stringify(learner));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  },

  getMisconceptions(): Misconception[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISCONCEPTIONS);
      return data ? JSON.parse(data) : MOCK_MISCONCEPTIONS;
    } catch {
      return MOCK_MISCONCEPTIONS;
    }
  },

  saveMisconceptions(misconceptions: Misconception[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MISCONCEPTIONS, JSON.stringify(misconceptions));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  },

  getHistoryEvents(): LearningHistoryEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY_EVENTS);
      return data ? JSON.parse(data) : MOCK_HISTORY_EVENTS;
    } catch {
      return MOCK_HISTORY_EVENTS;
    }
  },

  saveHistoryEvents(events: LearningHistoryEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY_EVENTS, JSON.stringify(events));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  },

  getProblemHistory(): ProblemHistoryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROBLEM_HISTORY);
      return data ? JSON.parse(data) : MOCK_PROBLEM_HISTORY;
    } catch {
      return MOCK_PROBLEM_HISTORY;
    }
  },

  saveProblemHistory(history: ProblemHistoryRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROBLEM_HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEARNER);
      localStorage.removeItem(STORAGE_KEYS.MISCONCEPTIONS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY_EVENTS);
      localStorage.removeItem(STORAGE_KEYS.PROBLEM_HISTORY);
    } catch (e) {
      console.warn("Storage reset error", e);
    }
  },
};
