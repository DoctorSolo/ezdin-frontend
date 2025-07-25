import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Exemplo de estrutura de módulos igual à página inicial
const modules = [
  {
    id: 1,
    title: "Introdução",
    lessons: [
      { id: 1, title: "Boas-vindas" },
      { id: 2, title: "Como usar o ezDin" },
    ],
  },
  {
    id: 2,
    title: "Módulo 1: C",
    lessons: [
      { id: 3, title: "Aula 1 - Linguagem de Programação C" },
      { id: 4, title: "Aula 2 - Variáveis e Tipos de Dados" },
      { id: 5, title: "Aula 3 - Estruturas de Controle" },
    ],
  },
];

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

const SidebarTrilhaDireita = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLessonId = Number(location.pathname.split("/").pop());
  const [openModules, setOpenModules] = useState(modules.map((m) => m.id));

  const handleToggleModule = (id) => {
    setOpenModules((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  return (
    <aside className="hidden md:block fixed right-0 top-0 h-full w-[300px] bg-white border-l border-green-100 shadow z-30 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-bold text-green-800 mb-4">Aulas</h2>
        <ul className="space-y-2">
          {modules.map((mod) => (
            <li key={mod.id}>
              <button
                className="flex items-center w-full justify-between px-2 py-2 text-green-800 font-semibold text-base focus:outline-none"
                onClick={() => handleToggleModule(mod.id)}
                aria-expanded={openModules.includes(mod.id)}
              >
                <span>{mod.title}</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    openModules.includes(mod.id) ? "rotate-90" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              {openModules.includes(mod.id) && (
                <ul className="pl-4 mt-1 space-y-1">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.id}>
                      <button
                        className={`flex items-center w-full px-2 py-1 rounded transition-colors text-left focus:outline-none focus:ring-2 focus:ring-green-500 text-sm
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
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                        ) : (
                          <span className="inline-block w-4 h-4 rounded-full border border-green-300 mr-2"></span>
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarTrilhaDireita;
