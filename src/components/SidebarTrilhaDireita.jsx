import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getConteudo } from "../data/conteudo";

const isLessonComplete = (moduloId, lessonId) => {
  const key = `lesson-answers-${moduloId}-${lessonId}`;
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
  const conteudo = getConteudo();
  const [openModules, setOpenModules] = useState(conteudo.map((m) => m.id));

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
          {conteudo.map((mod) => (
            <li key={mod.id}>
              <button
                className="flex items-center w-full justify-between px-2 py-2 text-green-800 font-semibold text-base focus:outline-none"
                onClick={() => handleToggleModule(mod.id)}
                aria-expanded={openModules.includes(mod.id)}
              >
                <span>{mod.nome}</span>
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
                  {mod.aulas.map((lesson) => (
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
                        aria-label={`Acessar aula ${lesson.titulo}`}
                        onClick={() => navigate(`/aula/${lesson.id}`)}
                      >
                        {isLessonComplete(mod.id, lesson.id) ? (
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                        ) : (
                          <span className="inline-block w-4 h-4 rounded-full border border-green-300 mr-2"></span>
                        )}
                        <span className="truncate">{lesson.titulo}</span>
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
