import React from "react";
import { useParams } from "react-router-dom";
import { allLessons } from "../data/allLessons";
import LessonPage from "./LessonPage";

const LessonPageWrapper = () => {
  const { id } = useParams();
  const lessonData = allLessons.find((l) => l.id === Number(id));
  if (!lessonData)
    return (
      <div className="p-8 text-center text-red-600">Aula não encontrada</div>
    );
  return <LessonPage lessonData={lessonData} />;
};

export default LessonPageWrapper;
