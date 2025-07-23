import React from "react";
import Logo2 from "../assets/Logo2.png";

const CoursePlatformPage = () => {
  // Dados mockados para demonstração
  const userName = "Usuário"; // Removido nome fixo
  const courseName = "Trilha de Educação Financeira";
  const progress = 7; // aulas concluídas
  const totalLessons = 20;
  const progressPercent = Math.round((progress / totalLessons) * 100);
  const unreadForum = 99;
  const courses = [
    { id: 1, name: "Trilha de Educação Financeira", active: true },
    { id: 2, name: "Planejamento de Gastos", active: false },
    { id: 3, name: "Desafios Financeiros", active: false },
    { id: 4, name: "Ferramentas de Controle", active: false },
  ];
  const sections = [
    {
      id: 1,
      title: "Introdução",
      lessons: [
        { id: 1, title: "Boas-vindas", done: true },
        { id: 2, title: "Como usar o ezDin", done: true },
      ],
    },
    {
      id: 2,
      title: "Fundamentos",
      lessons: [
        { id: 3, title: "O que é educação financeira?", done: true },
        { id: 4, title: "Controle de Gastos", done: false },
        { id: 5, title: "Evite dívidas", done: false },
      ],
    },
    {
      id: 3,
      title: "Prática",
      lessons: [
        { id: 6, title: "Planejamento de Objetivos", done: false },
        { id: 7, title: "Desafios", done: false },
        { id: 8, title: "Ferramentas ezDin", done: false },
      ],
    },
  ];

  // Estado para seções colapsáveis
  const [openSections, setOpenSections] = React.useState([1]);
  const handleToggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar fixa */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-green-600 border-b border-green-700 z-30 flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <img src={Logo2} alt="Logo ezDin" className="w-10 h-10 mr-2" />
          <span className="text-2xl font-extrabold text-white tracking-tight">
            ezDin
          </span>
          <span className="ml-3 text-white text-base font-medium hidden sm:block">
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
          >
            <span className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-bold border border-green-300">
              U
            </span>
          </button>
        </div>
      </nav>

      {/* Layout principal */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar fixa */}
        <aside className="w-72 bg-green-50 border-r border-green-200 h-[calc(100vh-4rem)] fixed top-16 left-0 flex flex-col z-20">
          {/* Logo */}
          <div className="h-20 flex flex-col items-center justify-center border-b border-green-100">
            <img src={Logo2} alt="Logo ezDin" className="w-14 h-14 mb-1" />
            <span className="text-xl font-extrabold text-green-700 tracking-tight">
              ezDin
            </span>
            <span className="text-green-600 text-xs font-medium">
              Aprenda, controle. Fácil assim!
            </span>
          </div>
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
          {/* Cursos */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            <div className="text-xs font-semibold text-green-400 uppercase mb-2">
              Trilhas
            </div>
            <nav className="flex flex-col gap-1">
              {courses.map((course) => (
                <a
                  key={course.id}
                  href="#"
                  className={`px-3 py-2 rounded flex items-center justify-between font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    course.active
                      ? "bg-green-600 text-white"
                      : "text-green-900 hover:bg-green-100"
                  }`}
                  tabIndex={0}
                  aria-label={course.name}
                >
                  <span>{course.name}</span>
                  {course.active && (
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
                  )}
                </a>
              ))}
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
                {unreadForum > 99 ? "99+" : unreadForum}
              </span>
            </button>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 ml-72 p-10">
          {/* Nome do curso */}
          <h1 className="text-3xl font-bold text-green-700 mb-2">
            {courseName}
          </h1>
          {/* Boas-vindas + botão continuar */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-lg text-green-800">
              Bem-vindo, <span className="font-semibold">{userName}</span>!
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              tabIndex={0}
              aria-label="Continuar de onde parou"
            >
              Continuar
            </button>
          </div>
          {/* Barra de progresso */}
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
          {/* Seções colapsáveis */}
          <div className="space-y-4">
            {sections.map((section) => (
              <section
                key={section.id}
                className="bg-white rounded-lg shadow border border-green-100"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => handleToggleSection(section.id)}
                  tabIndex={0}
                  aria-label={`Seção ${section.title}`}
                  aria-expanded={openSections.includes(section.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      handleToggleSection(section.id);
                  }}
                >
                  <span className="font-semibold text-green-800">
                    {section.title}{" "}
                    <span className="ml-2 text-xs text-green-400">
                      ({section.lessons.length} aulas)
                    </span>
                  </span>
                  <svg
                    className={`w-5 h-5 text-green-400 transform transition-transform ${
                      openSections.includes(section.id)
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openSections.includes(section.id) && (
                  <ul className="px-6 pb-4">
                    {section.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-3 py-2"
                      >
                        {lesson.done ? (
                          <svg
                            className="w-5 h-5 text-green-500"
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
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full border-2 border-green-300 inline-block"
                            aria-label="Aula não concluída"
                          ></span>
                        )}
                        <span
                          className={`text-green-900 ${
                            lesson.done ? "line-through" : ""
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlatformPage;
