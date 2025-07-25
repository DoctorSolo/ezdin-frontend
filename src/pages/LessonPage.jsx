import React, { useState, useEffect, useRef, useCallback } from "react";
import LessonExplanation from "../components/LessonExplanation";
import LessonQuestionsNav from "../components/LessonQuestionsNav";
import LessonQuestion from "../components/LessonQuestion";
import { useNavigate } from "react-router-dom";
import SidebarTrilhaDireita from "../components/SidebarTrilhaDireita";
import { conteudo } from "../data/conteudo";

const LessonPage = ({ lessonData }) => {
  const LESSON_STORAGE_KEY = `lesson-answers-${lessonData?.moduloId || "mod"}-${
    lessonData?.id || "default"
  }`;
  const navigate = useNavigate();
  const lastLessonIdRef = useRef(lessonData.id);

  // Carregar respostas do localStorage, se existirem
  const getInitialAnswers = useCallback(() => {
    if (!lessonData || !Array.isArray(lessonData.questoes)) return [];
    const saved = localStorage.getItem(LESSON_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.length === lessonData.questoes.length
      ) {
        return parsed;
      }
    }
    return Array(lessonData.questoes.length).fill(null);
  }, [lessonData, LESSON_STORAGE_KEY]);

  const [activeTab, setActiveTab] = useState("explanation");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState(getInitialAnswers);
  const [showResults, setShowResults] = useState(false);

  // Sempre que lessonData mudar, recarregar as respostas corretas do localStorage
  useEffect(() => {
    setAnswers(getInitialAnswers());
  }, [lessonData, getInitialAnswers]);

  useEffect(() => {
    if (lessonData) {
      localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers, LESSON_STORAGE_KEY, lessonData]);

  useEffect(() => {
    if (lessonData && lessonData.id !== lastLessonIdRef.current) {
      setActiveTab("explanation");
      setActiveQuestion(0);
      setShowResults(false);
      lastLessonIdRef.current = lessonData.id;
    }
    // eslint-disable-next-line
  }, [lessonData?.id]);

  // Proteção defensiva após todos os hooks
  if (!lessonData || !Array.isArray(lessonData.questoes)) {
    return (
      <div className="p-8 text-center text-red-600">
        Aula inválida ou sem questões.
      </div>
    );
  }

  // Verificar se lessonData existe após os hooks
  if (!lessonData) {
    return (
      <div className="p-8 text-center text-red-600">
        Dados da aula não encontrados
      </div>
    );
  }

  const handleSelectQuestion = (index) => {
    setActiveTab("question");
    setActiveQuestion(index);
  };

  const handleShowExplanation = () => {
    setActiveTab("explanation");
  };

  // Atualiza resposta da questão
  const handleAnswer = (questionIdx, answerIdx) => {
    setAnswers((prev) => {
      if (prev[questionIdx] !== null) return prev; // Não permite trocar resposta
      const updated = [...prev];
      updated[questionIdx] = answerIdx;
      return updated;
    });
  };

  // Navegação Voltar/Próxima
  const handlePrev = () => {
    if (showResults) {
      // Voltar à home
      window.location.href = "/plataforma";
      return;
    }
    if (activeTab === "question" && activeQuestion > 0) {
      setActiveQuestion((prev) => prev - 1);
    } else if (activeTab === "question" && activeQuestion === 0) {
      setActiveTab("explanation");
    }
  };
  const handleNext = () => {
    if (showResults) {
      // Rever aula
      setShowResults(false);
      setActiveTab("explanation");
      setActiveQuestion(0);
      return;
    }
    if (activeTab === "explanation") {
      setActiveTab("question");
      setActiveQuestion(0);
    } else if (
      activeTab === "question" &&
      activeQuestion < lessonData.questoes.length - 1
    ) {
      setActiveQuestion((prev) => prev + 1);
    }
  };

  // Função para ir para a próxima aula
  const handleNextLesson = () => {
    // Busca a próxima aula na ordem dos módulos/aulas em conteudo.js
    let found = false;
    let nextAulaId = null;
    for (let m = 0; m < conteudo.length; m++) {
      for (let a = 0; a < conteudo[m].aulas.length; a++) {
        if (found) {
          nextAulaId = conteudo[m].aulas[a].id;
          break;
        }
        if (conteudo[m].aulas[a].id === lessonData.id) {
          found = true;
        }
      }
      if (nextAulaId) break;
    }
    if (nextAulaId) {
      navigate(`/aula/${nextAulaId}`);
    }
  };

  // Função para saber se há próxima aula
  const hasNextAula = (() => {
    let found = false;
    let hasNext = false;
    for (let m = 0; m < conteudo.length; m++) {
      for (let a = 0; a < conteudo[m].aulas.length; a++) {
        if (found) {
          hasNext = true;
          break;
        }
        if (conteudo[m].aulas[a].id === lessonData.id) {
          found = true;
        }
      }
      if (hasNext) break;
    }
    return hasNext;
  })();

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter(
    (a, i) => lessonData.questoes[i] && a === lessonData.questoes[i].correta
  ).length;
  const errorList = lessonData.questoes
    .map((q, i) => ({
      ...q,
      userAnswer: answers[i],
      isCorrect: answers[i] === q.correta,
    }))
    .filter((q) => !q.isCorrect);

  if (showResults) {
    return (
      <div className="flex">
        <div className="flex-1 mr-0 md:mr-[300px]">
          <div className="max-w-4xl mx-auto p-4 pb-24">
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold mb-2">
                Você acertou {correctCount}/{lessonData.questoes.length}{" "}
                questões em "{lessonData.titulo}"
              </div>
              <div className="w-full max-w-lg mb-4">
                <div className="flex items-center gap-4 text-sm mb-2">
                  <span className="text-green-600">{correctCount} acertos</span>
                  <span className="text-red-600">
                    {lessonData.questoes.length - correctCount} erros
                  </span>
                  <span className="ml-auto">
                    {answers.filter((a) => a !== null).length}/
                    {lessonData.questoes.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-green-500 rounded"
                    style={{
                      width: `${
                        (correctCount / lessonData.questoes.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-full max-w-lg mb-8">
                <div className="font-bold mb-2">Aproveitamento na lista</div>
                <div className="mb-2 font-semibold">Erros</div>
                {errorList.length === 0 ? (
                  <div className="text-green-600">Nenhum erro! Parabéns!</div>
                ) : (
                  errorList.map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-white border border-red-200 rounded-lg p-4 mb-3 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
                        <span>✖ Questão {idx + 1}</span>
                      </div>
                      <div className="text-gray-700 text-sm mb-1">
                        {q.enunciado}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Sua resposta:{" "}
                        <span className="font-semibold">
                          {q.opcoes[q.userAnswer] || "Não respondida"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">
                        Correta:{" "}
                        <span className="font-semibold">
                          {q.opcoes[q.correta]}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Remover a seção 'Continue estudando' */}
            </div>
          </div>
          {/* Barra inferior para navegação */}
          <div
            className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between items-center px-90 py-4 z-40"
            style={{
              boxShadow: "0 -8px 24px -8px rgba(0,0,0,0.10)",
              marginRight: "300px",
              width: "calc(100% - 300px)",
            }}
          >
            <button
              className="px-8 py-2 rounded-md text-center text-gray-700 font-bold text-2xl focus:outline-none transition-colors hover:bg-gray-100"
              onClick={handlePrev}
            >
              Voltar à home
            </button>
            <button
              className="px-8 py-2 rounded-md text-center text-green-600 font-bold text-2xl focus:outline-none transition-colors hover:bg-green-50"
              onClick={handleNext}
            >
              Rever aula
            </button>
            <button
              className={
                "px-8 py-2 rounded-md text-center text-white font-bold text-2xl focus:outline-none transition-colors " +
                (hasNextAula
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-300 opacity-50 cursor-not-allowed")
              }
              onClick={hasNextAula ? handleNextLesson : undefined}
              disabled={!hasNextAula}
              aria-disabled={!hasNextAula}
              tabIndex={hasNextAula ? 0 : -1}
            >
              Próxima aula
            </button>
          </div>
        </div>
        <SidebarTrilhaDireita />
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 mr-0 md:mr-[300px]">
        <div className="max-w-4xl mx-auto p-4 pb-24 min-h-screen">
          {/* Breadcrumb e título */}
          <nav className="text-sm mb-2" aria-label="Breadcrumb">
            <ol className="list-reset flex text-green-600">
              <li>Curso</li>
              <li className="mx-2">/</li>
              <li>Módulo 1</li>
              <li className="mx-2">/</li>
              <li className="font-semibold text-green-800">
                {lessonData.titulo}
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold mb-2 text-green-800">
            {lessonData.titulo}
          </h1>
          <div className="flex items-center mb-4">
            <button
              className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium text-base focus:outline-none focus:ring-2 focus:ring-green-400 rounded px-2 py-1"
              onClick={() => (window.location.href = "/plataforma")}
              aria-label="Voltar para a Trilha"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Voltar para a Trilha
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-green-400">Aula {lessonData.id}</span>
          </div>
          {/* Navegação das questões */}
          <LessonQuestionsNav
            questions={lessonData.questoes}
            onSelect={handleSelectQuestion}
            activeIndex={activeTab === "question" ? activeQuestion : null}
            onShowExplanation={handleShowExplanation}
            isExplanationActive={activeTab === "explanation"}
          />
          {/* Conteúdo */}
          <div className="mt-6 min-h-[300px]">
            {activeTab === "explanation" ? (
              <div className="bg-white border border-green-100 rounded-lg shadow p-6">
                <LessonExplanation
                  text={lessonData.explicacoes[0]}
                  canFinish={allAnswered}
                />
              </div>
            ) : (
              <div className="bg-white border border-green-100 rounded-lg shadow p-6">
                <LessonQuestion
                  question={lessonData.questoes[activeQuestion]}
                  questionIndex={activeQuestion}
                  totalQuestions={lessonData.questoes.length}
                  selected={answers[activeQuestion]}
                  onBack={handleShowExplanation}
                  onSelectQuestion={handleSelectQuestion}
                  onAnswer={handleAnswer}
                />
              </div>
            )}
          </div>
        </div>
        {/* Barra inferior ajustada */}
        <div
          className="fixed bottom-0 left-0 w-full bg-white border-t border-green-100 flex justify-between items-center px-90 py-4 z-40"
          style={{
            boxShadow: "0 -8px 24px -8px rgba(0,0,0,0.10)",
            marginRight: "300px",
            width: "calc(100% - 300px)",
          }}
        >
          <button
            className="px-8 py-2 rounded-md text-center text-gray-700 font-bold text-2xl focus:outline-none disabled:text-gray-300 transition-colors hover:bg-green-100"
            onClick={handlePrev}
            disabled={activeTab === "explanation"}
            style={{ border: "none" }}
          >
            Voltar
          </button>
          {activeTab === "question" &&
          activeQuestion === lessonData.questoes.length - 1 ? (
            <button
              className="px-8 py-2 rounded-md text-center text-white font-bold text-2xl focus:outline-none transition-colors bg-green-500 hover:bg-green-600 disabled:text-green-200 disabled:cursor-not-allowed"
              onClick={() => allAnswered && setShowResults(true)}
              disabled={!allAnswered}
              style={{ border: "none" }}
            >
              Concluir aula
            </button>
          ) : (
            <button
              className="px-8 py-2 rounded-md text-center text-white font-bold text-2xl focus:outline-none transition-colors bg-green-500 hover:bg-green-600 disabled:text-green-200 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={
                activeTab === "question" &&
                activeQuestion === lessonData.questoes.length - 1
              }
              style={{ border: "none" }}
            >
              Próxima
            </button>
          )}
        </div>
      </div>
      <SidebarTrilhaDireita />
    </div>
  );
};

export default LessonPage;
