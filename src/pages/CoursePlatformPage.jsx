import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo_full_branca from "../assets/logo_full_branca.png";
import { getConteudo, isLessonComplete } from "../data/conteudo";
import LessonPage from "./LessonPage";

const CoursePlatformPage = () => {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Flatten all aulas for quick lookup
  const conteudo = getConteudo();
  const allAulas = conteudo.flatMap((m) =>
    m.aulas.map((a) => ({ ...a, moduloId: m.id, moduloNome: m.nome }))
  );
  const getLessonById = (id) => allAulas.find((a) => a.id === id);

  // Progresso
  const totalLessons = allAulas.length;
  const progress = allAulas.filter((aula) =>
    isLessonComplete(aula.moduloId, aula.id)
  ).length;
  const progressPercent = totalLessons
    ? Math.round((progress / totalLessons) * 100)
    : 0;

  // Renderizar LessonPage se uma lição estiver selecionada
  if (selectedLesson) {
    const lessonData = getLessonById(selectedLesson);
    if (!lessonData) return <div className="p-8">Aula não encontrada.</div>;
    return (
      <LessonPage
        lessonData={lessonData}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  const handleLessonClick = (lessonId) => {
    // Força um reload completo para evitar problemas de estado
    window.location.href = `/aula/${lessonId}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar fixa */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-green-600 border-b border-green-700 z-30 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <img
            src={logo_full_branca}
            alt="Logo ezDin"
            className="w-25 h-7 mr-2"
          />
          <span className=" ml-2 text-white text-base font-medium hidden sm:block">
            Aprenda, controle. Fácil assim!
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-80 px-4 py-2 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 text-green-900"
            aria-label="Pesquisar"
          />
        </div>
        <div className="flex items-center gap-4">
          {/* Notificações */}
          <button
            className="relative p-2 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Notificações"
            tabIndex={0}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          {/* Perfil */}
          <button
            className="flex items-center gap-2 p-1 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Perfil"
            tabIndex={0}
            onClick={() => navigate("/perfil")}
          >
            <span className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold border border-green-300">
              CK
            </span>
          </button>
        </div>
      </nav>
      {/* Layout principal */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar fixa original */}
        <aside className="w-72 bg-green-50 border-r border-green-200 h-[calc(100vh-4rem)] fixed top-16 left-0 flex flex-col z-20">
          {/* Comece Aqui */}
          <div className="px-6 py-4">
            <div className="text-xs font-semibold text-green-400 uppercase mb-2">
              Comece Aqui
            </div>
            <nav className="flex flex-col gap-1">
              <a
                href="#"
                className="px-3 py-2 rounded text-green-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                tabIndex={0}
                aria-label="Apresentações"
              >
                Apresentações
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded text-green-900 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                tabIndex={0}
                aria-label="Atualizações"
              >
                Atualizações
              </a>
            </nav>
          </div>
          {/* Trilhas */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-green-400 uppercase mb-2">
              Trilhas
            </div>
            <nav className="flex flex-col gap-1">
              <a
                href="#"
                className="px-3 py-2 rounded flex items-center justify-between font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-600 text-white"
                tabIndex={0}
                aria-label="Trilha de Educação Financeira"
              >
                <span>Trilha de Educação Financeira</span>
                <svg
                  className="w-4 h-4 ml-2 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded flex items-center justify-between font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900 hover:bg-green-100"
                tabIndex={0}
                aria-label="Planejamento de Gastos"
              >
                <span>Planejamento de Gastos</span>
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded flex items-center justify-between font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900 hover:bg-green-100"
                tabIndex={0}
                aria-label="Desafios Financeiros"
              >
                <span>Desafios Financeiros</span>
              </a>
              <a
                href="#"
                className="px-3 py-2 rounded flex items-center justify-between font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900 hover:bg-green-100"
                tabIndex={0}
                aria-label="Ferramentas de Controle"
              >
                <span>Ferramentas de Controle</span>
              </a>
            </nav>
          </div>
          {/* Fórum */}
          <div className="px-6 py-4 border-t border-green-100 flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-green-900 font-medium hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              tabIndex={0}
              aria-label="Fórum"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2h2"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 3h6v6"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2 4 4"
                />
              </svg>
              <span>Fórum</span>
              <span className="ml-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[2.5rem] text-center">
                99+
              </span>
            </button>
          </div>
        </aside>
        {/* Conteúdo principal */}
        <main className="flex-1 ml-72 p-10">
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            Trilha de Educação Financeira
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-3 bg-green-100 rounded-full overflow-hidden">
              <div
                className="h-3 bg-green-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-sm text-green-700 whitespace-nowrap">
              {progress} de {totalLessons} aulas • {progressPercent}% concluído
            </div>
          </div>
          {/* Seções de módulos e aulas */}
          <div className="space-y-4">
            {conteudo.map((modulo) => (
              <section
                key={modulo.id}
                className="bg-white rounded-lg shadow border border-green-100"
              >
                <div className="w-full flex items-center justify-between px-6 py-4">
                  <span className="font-semibold text-green-800">
                    {modulo.nome}{" "}
                    <span className="ml-2 text-xs text-green-400">
                      ({modulo.aulas.length} aulas)
                    </span>
                  </span>
                </div>
                <ul className="px-6 pb-4">
                  {modulo.aulas.map((aula) => (
                    <li key={aula.id} className="flex items-center gap-3 py-2">
                      <button
                        className={`flex items-center gap-2 px-2 py-1 rounded transition-colors w-full text-left focus:outline-none focus:ring-2 focus:ring-green-500
                          ${
                            isLessonComplete(modulo.id, aula.id)
                              ? "bg-green-50 hover:bg-green-100"
                              : "bg-white hover:bg-green-50"
                          }
                          hover:border-green-400 border border-transparent`}
                        tabIndex={0}
                        aria-label={`Acessar aula ${aula.titulo}`}
                        onClick={() => handleLessonClick(aula.id)}
                      >
                        {isLessonComplete(modulo.id, aula.id) ? (
                          <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
                        ) : (
                          <span className="inline-block w-5 h-5 rounded-full border border-green-300 mr-2"></span>
                        )}
                        <span className="text-green-900">{aula.titulo}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlatformPage;
