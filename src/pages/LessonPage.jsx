import React, { useState, useEffect, useRef, useCallback } from "react";
import LessonExplanation from "../components/LessonExplanation";
import LessonQuestionsNav from "../components/LessonQuestionsNav";
import LessonQuestion from "../components/LessonQuestion";
import SidebarTrilhaDireita from "../components/SidebarTrilhaDireita";
import { conteudo } from "../data/conteudo";
import { useScore } from "../hooks/useScore";
import ScoreNotification from "../components/ScoreNotification";

const LessonPage = ({ lessonData }) => {
  // Garantir que moduloId seja tratado corretamente, mesmo sendo 0
  const LESSON_STORAGE_KEY = `lesson-answers-${lessonData?.moduloId ?? "mod"}-${
    lessonData?.id ?? "default"
  }`;
  const lastLessonIdRef = useRef(lessonData.id);

  // Carregar respostas do localStorage, se existirem
  const getInitialAnswers = useCallback(() => {
    if (!lessonData || !Array.isArray(lessonData.questoes)) return [];
    const saved = localStorage.getItem(LESSON_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.length === lessonData.questoes.length &&
        parsed.every((a) => a !== null) // Só carrega se TODAS as respostas foram dadas
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
  const { addScoreForLesson, isLessonScored, score } = useScore();

  // Sempre que lessonData mudar, recarregar as respostas corretas do localStorage
  useEffect(() => {
    const newAnswers = getInitialAnswers();
    setAnswers(newAnswers);
    setActiveTab("explanation");
    setActiveQuestion(0);
    setShowResults(false);
  }, [lessonData, getInitialAnswers]);

  useEffect(() => {
    // Só salva se pelo menos uma resposta foi dada
    if (lessonData && answers.some((a) => a !== null)) {
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

  // Calcular valores derivados
  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter(
    (a, i) => lessonData.questoes[i] && a === lessonData.questoes[i].correta
  ).length;

  // Adicionar pontuação quando a aula é concluída pela primeira vez
  useEffect(() => {
    if (
      showResults &&
      allAnswered &&
      lessonData?.moduloId !== undefined &&
      lessonData?.id !== undefined
    ) {
      const alreadyScored = isLessonScored(lessonData.moduloId, lessonData.id);
      if (!alreadyScored) {
        addScoreForLesson(lessonData.moduloId, lessonData.id, correctCount);
      }
    }
  }, [
    showResults,
    allAnswered,
    correctCount,
    lessonData,
    addScoreForLesson,
    isLessonScored,
  ]);

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
      // Força um reload completo para evitar problemas de estado
      window.location.href = `/aula/${nextAulaId}`;
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

  const errorList = lessonData.questoes
    .map((q, i) => ({
      ...q,
      userAnswer: answers[i],
      isCorrect: answers[i] === q.correta,
    }))
    .filter((q) => !q.isCorrect);

  // Renderizar tela de resultados
  if (showResults) {
    // Adicionar pontuação quando a aula é concluída pela primeira vez
    let pointsEarned = 0;
    const alreadyScored = isLessonScored(lessonData.moduloId, lessonData.id);

    if (allAnswered && !alreadyScored) {
      pointsEarned = addScoreForLesson(
        lessonData.moduloId,
        lessonData.id,
        correctCount
      );
    }

    return (
      <div className="flex">
        <div className="flex-1 mr-0 md:mr-[300px]">
          <div className="max-w-4xl mx-auto p-4 pb-24">
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold mb-2">
                Você acertou {correctCount}/{lessonData.questoes.length}{" "}
                questões em "{lessonData.titulo}"
              </div>

              {/* Pontuação do usuário */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 w-full max-w-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold text-yellow-800">
                      Sua Pontuação Total
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    {score.toLocaleString()}
                  </span>
                </div>
              </div>
              {pointsEarned > 0 && (
                <ScoreNotification pointsEarned={pointsEarned} show={true} />
              )}
              {pointsEarned === 0 && !alreadyScored && allAnswered && (
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-blue-800">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold">
                      Aula já pontuada anteriormente!
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Esta aula já foi concluída e pontuada. Continue estudando
                    para ganhar mais pontos!
                  </p>
                </div>
              )}
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
              {/* Detalhamento da pontuação por questão */}
              <div className="w-full max-w-lg mb-6">
                <div className="font-bold mb-3 text-center">
                  Pontuação por Questão
                </div>
                <div className="space-y-2">
                  {lessonData.questoes.map((questao, index) => {
                    const isCorrect = answers[index] === questao.correta;
                    const pointsForQuestion = isCorrect ? 100 : 0;

                    return (
                      <div
                        key={questao.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isCorrect
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {isCorrect ? "✓" : "✗"}
                          </div>
                          <span className="font-medium">
                            Questão {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isCorrect ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {pointsForQuestion} pontos
                          </span>
                          {isCorrect && (
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumo da pontuação */}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-800">
                      Total desta aula:
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {correctCount * 100} pontos
                    </span>
                  </div>
                  <div className="text-sm text-blue-700">
                    {correctCount} questões corretas × 100 pontos ={" "}
                    {correctCount * 100} pontos
                  </div>
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
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
              }}
            >
              Voltar à home
            </button>
            <button
              className="px-8 py-2 rounded-md text-center text-gray-700 font-bold text-2xl focus:outline-none hover:bg-gray-100"
              onClick={handleNext}
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
              }}
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
