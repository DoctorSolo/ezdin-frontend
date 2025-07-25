import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { allLessons } from "../data/allLessons";

const isLessonComplete = (lessonId) => {
  const key = `lesson-answers-${lessonId}`;
  const saved = localStorage.getItem(key);
  if (!saved) return false;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every((a) => a !== null);
  } catch {
    return false;
  }
};

const SidebarTrilhaAulas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Extrai o id da aula atual da URL
  const currentLessonId = Number(location.pathname.split("/").pop());

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-green-100 shadow z-30 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-bold text-green-800 mb-4">
          Trilha de Aulas
        </h2>
        <ul className="space-y-1">
          {allLessons.map((lesson) => (
            <li key={lesson.id}>
              <button
                className={`flex items-center w-full px-3 py-2 rounded transition-colors text-left focus:outline-none focus:ring-2 focus:ring-green-500
                  ${
                    currentLessonId === lesson.id
                      ? "bg-green-50 border border-green-400 text-green-800 font-semibold"
                      : "bg-white hover:bg-green-50 border border-transparent text-gray-800"
                  }
                `}
                tabIndex={0}
                aria-label={`Acessar aula ${lesson.title}`}
                onClick={() => navigate(`/aula/${lesson.id}`)}
              >
                {isLessonComplete(lesson.id) ? (
                  <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-3"></span>
                ) : (
                  <span className="inline-block w-4 h-4 rounded-full border border-green-300 mr-3"></span>
                )}
                <span className="truncate">{lesson.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarTrilhaAulas;
