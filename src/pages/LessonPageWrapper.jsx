import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLessons } from "../contexts/LessonsContext";
import LessonPage from "./LessonPage";

const LessonPageWrapper = () => {
  const { id } = useParams();
  const { lessons, loading: lessonsLoading } = useLessons();
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonsLoading && lessons.length > 0) {
      const lesson = lessons.find(l => l.id === parseInt(id));
      setLessonData(lesson);
      setLoading(false);
    }
  }, [id, lessons, lessonsLoading]);

  if (loading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Carregando lição...</p>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="p-8 text-center text-red-600">
        Lição não encontrada
      </div>
    );
  }

  return <LessonPage lessonData={lessonData} />;
};

export default LessonPageWrapper;
