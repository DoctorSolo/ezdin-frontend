import React from "react";
import { useParams } from "react-router-dom";
import { getConteudo } from "../data/conteudo";
import LessonPage from "./LessonPage";

const LessonPageWrapper = () => {
  const { id } = useParams();
  // Buscar a aula pelo id em todos os módulos
  const conteudo = getConteudo();
  let lessonData = undefined;
  for (const modulo of conteudo) {
    const aula = modulo.aulas.find((a) => a.id === Number(id));
    if (aula) {
      lessonData = aula;
      lessonData.moduloId = modulo.id;
      break;
    }
  }
  if (!lessonData)
    return (
      <div className="p-8 text-center text-red-600">Aula não encontrada</div>
    );
  return <LessonPage lessonData={lessonData} />;
};

export default LessonPageWrapper;
