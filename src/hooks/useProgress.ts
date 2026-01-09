import { useState, useEffect, useCallback } from 'react';
import { ProgressData, UserResponse } from '@/types/scenario';

const STORAGE_KEY = 'deutsch-ueben-progress';

const initialProgress: ProgressData = {
  completedScenarios: [],
  responses: [],
  totalScore: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(initialProgress);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProgress(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse progress data:', e);
      }
    }
  }, []);

  const saveProgress = useCallback((newProgress: ProgressData) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, []);

  const addResponse = useCallback((response: UserResponse) => {
    const existingIndex = progress.responses.findIndex(
      (r) => r.scenarioId === response.scenarioId && r.promptId === response.promptId
    );

    let newResponses: UserResponse[];
    if (existingIndex >= 0) {
      newResponses = [...progress.responses];
      newResponses[existingIndex] = {
        ...response,
        attempts: (progress.responses[existingIndex].attempts || 0) + 1,
      };
    } else {
      newResponses = [...progress.responses, { ...response, attempts: 1 }];
    }

    const newCompletedScenarios = progress.completedScenarios.includes(response.scenarioId)
      ? progress.completedScenarios
      : [...progress.completedScenarios, response.scenarioId];

    const totalScore = newResponses.reduce((sum, r) => sum + r.score, 0);

    saveProgress({
      completedScenarios: newCompletedScenarios,
      responses: newResponses,
      totalScore,
    });
  }, [progress, saveProgress]);

  const getScenarioScore = useCallback((scenarioId: string): number | null => {
    const response = progress.responses.find((r) => r.scenarioId === scenarioId);
    return response?.score ?? null;
  }, [progress]);

  const getScenarioAttempts = useCallback((scenarioId: string): number => {
    const response = progress.responses.find((r) => r.scenarioId === scenarioId);
    return response?.attempts ?? 0;
  }, [progress]);

  const resetProgress = useCallback(() => {
    saveProgress(initialProgress);
  }, [saveProgress]);

  return {
    progress,
    addResponse,
    getScenarioScore,
    getScenarioAttempts,
    resetProgress,
  };
}
