import { useState, useEffect } from "react";

const SCORE_STORAGE_KEY = "user-score";
const COMPLETED_LESSONS_KEY = "completed-lessons";

export const useScore = () => {
  const [score, setScore] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  // Carregar pontuação e aulas completadas do localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem(SCORE_STORAGE_KEY);
    const savedCompletedLessons = localStorage.getItem(COMPLETED_LESSONS_KEY);

    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }

    if (savedCompletedLessons) {
      try {
        const parsed = JSON.parse(savedCompletedLessons);
        setCompletedLessons(new Set(parsed));
      } catch {
        // Erro silencioso ao carregar aulas completadas
      }
    }
  }, []);

  // Função para adicionar pontos quando uma aula é concluída
  const addScoreForLesson = (moduloId, aulaId, correctAnswers) => {
    const lessonKey = `${moduloId}-${aulaId}`;

    // Verificar se a aula já foi completada para evitar pontuação duplicada
    if (completedLessons.has(lessonKey)) {
      return;
    }

    // Calcular pontos (100 por questão acertada)
    const pointsEarned = correctAnswers * 100;
    const newScore = score + pointsEarned;

    // Atualizar estado
    setScore(newScore);
    setCompletedLessons((prev) => {
      const newCompletedLessons = new Set([...prev, lessonKey]);

      // Salvar no localStorage com o novo estado
      localStorage.setItem(SCORE_STORAGE_KEY, newScore.toString());
      localStorage.setItem(
        COMPLETED_LESSONS_KEY,
        JSON.stringify([...newCompletedLessons])
      );

      return newCompletedLessons;
    });

    return pointsEarned;
  };

  // Função para verificar se uma aula já foi pontuada
  const isLessonScored = (moduloId, aulaId) => {
    const lessonKey = `${moduloId}-${aulaId}`;
    return completedLessons.has(lessonKey);
  };

  // Função para resetar pontuação (útil para testes)
  const resetScore = () => {
    setScore(0);
    setCompletedLessons(new Set());
    localStorage.removeItem(SCORE_STORAGE_KEY);
    localStorage.removeItem(COMPLETED_LESSONS_KEY);
  };

  // Função para obter estatísticas
  const getScoreStats = () => {
    return {
      totalScore: score,
      completedLessonsCount: completedLessons.size,
      averageScorePerLesson:
        completedLessons.size > 0
          ? Math.round(score / completedLessons.size)
          : 0,
    };
  };

  return {
    score,
    completedLessons: Array.from(completedLessons),
    addScoreForLesson,
    isLessonScored,
    resetScore,
    getScoreStats,
  };
};
