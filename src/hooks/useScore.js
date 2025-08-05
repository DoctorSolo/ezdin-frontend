// hooks/useScore.js
import { useState, useEffect } from "react";

export const useScore = () => {
  const [score, setScore] = useState(0);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getScoreStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://ezdin-backend.onrender.com/api/lessons/current_user_progress", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erro ao buscar progresso do usuário.");
      }
      const data = await response.json();
      setScore(data.total_points);
      setCompletedLessonsCount(data.completed_lessons_count);
    } catch (error) {
      console.error("Erro ao buscar progresso:", error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getScoreStats();
  }, []);

  return {
    score,
    completedLessonsCount,
    isLoading,
    getScoreStats,
  };
};