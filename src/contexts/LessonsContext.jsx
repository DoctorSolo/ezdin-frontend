import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const LessonsContext = createContext();

export const useLessons = () => {
  const context = useContext(LessonsContext);
  if (!context) {
    throw new Error('useLessons must be used within a LessonsProvider');
  }
  return context;
};

export const LessonsProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState(null);
  const { isAuthenticated } = useAuth();

  // Carregar lições quando o usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadLessons();
      loadUserProgress();
    } else {
      setLessons([]);
      setUserProgress(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLessons();
      setLessons(response);
    } catch (error) {
      console.error('Erro ao carregar lições:', error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const response = await apiService.getUserProgress();
      setUserProgress(response);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      setUserProgress(null);
    }
  };

  const getLessonById = async (lessonId) => {
    try {
      const response = await apiService.getLessonById(lessonId);
      return response;
    } catch (error) {
      console.error('Erro ao carregar lição:', error);
      throw error;
    }
  };

  const completeLesson = async (lessonId, answer) => {
    try {
      const response = await apiService.completeLesson(lessonId, answer);
      // Recarregar progresso após completar lição
      await loadUserProgress();
      await loadLessons(); // Atualizar status de conclusão
      return response;
    } catch (error) {
      console.error('Erro ao completar lição:', error);
      throw error;
    }
  };

  const createLesson = async (lessonData) => {
    try {
      const response = await apiService.createLesson(lessonData);
      // Recarregar lições após criar nova
      await loadLessons();
      return response;
    } catch (error) {
      console.error('Erro ao criar lição:', error);
      throw error;
    }
  };

  const value = {
    lessons,
    loading,
    userProgress,
    loadLessons,
    loadUserProgress,
    getLessonById,
    completeLesson,
    createLesson,
  };

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  );
};
