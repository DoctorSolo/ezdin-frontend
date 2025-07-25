import React, { useState, useEffect } from "react";
import LessonExplanation from "../components/LessonExplanation";
import LessonQuestionsNav from "../components/LessonQuestionsNav";
import LessonQuestion from "../components/LessonQuestion";
import { useNavigate } from "react-router-dom";

// Exemplo de dados mockados
const lessonData = {
  id: 1,
  title: "Aula 1 - Linguagem de Programação C",
  explanation:
    "Nesta lição, você aprenderá sobre a linguagem C, compilação, funções, argumentos, ferramentas, comandos, operadores, estruturas condicionais, repetição, booleanos, abstração, header de arquivos, função main, memória, imprecisão e overflow.",
  questions: [
    {
      id: 1,
      statement:
        "Em uma época de intenso calor, um aparelho de ar-condicionado com potência de 1500W ficou ligado por mais tempo, chegando à marca mensal de consumo igual a 7500W.h. Determine por quanto tempo esse aparelho ficou ligado por dia.",
      options: ["a) 2h", "b) 4h", "c) 5h", "d) 6h", "e) 7,5h"],
      correct: 2,
      explanation:
        "Para encontrar o tempo diário, divida o consumo mensal (7500Wh) pela potência (1500W) para obter o total de horas no mês: 7500 / 1500 = 5h por dia.",
    },
    {
      id: 2,
      statement: "Qual é a função do header de arquivos em C?",
      options: [
        "a) Definir variáveis globais",
        "b) Incluir bibliotecas e definições",
        "c) Executar o programa principal",
        "d) Gerenciar memória",
        "e) Nenhuma das anteriores",
      ],
      correct: 1,
      explanation:
        "O header de arquivos em C serve para incluir bibliotecas e definições, permitindo o uso de funções e recursos externos.",
    },
  ],
};

const LESSON_STORAGE_KEY = `lesson-answers-${lessonData.id}`;

const LessonPage = () => {
  const navigate = useNavigate();
  // Carregar respostas do localStorage, se existirem
  const getInitialAnswers = () => {
    const saved = localStorage.getItem(LESSON_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        Array.isArray(parsed) &&
        parsed.length === lessonData.questions.length
      ) {
        return parsed;
      }
    }
    return Array(lessonData.questions.length).fill(null);
  };

  const [activeTab, setActiveTab] = useState("explanation");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [answers, setAnswers] = useState(getInitialAnswers);
  const [showResults, setShowResults] = useState(false);

  // Salvar respostas no localStorage sempre que answers mudar
  useEffect(() => {
    localStorage.setItem(LESSON_STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

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
      activeQuestion < lessonData.questions.length - 1
    ) {
      setActiveQuestion((prev) => prev + 1);
    }
  };

  // Função para ir para a próxima aula
  const handleNextLesson = () => {
    const nextLessonId = lessonData.id + 1;
    // Supondo que as aulas seguem a rota /aula/{id}
    navigate(`/aula/${nextLessonId}`);
  };

  const allAnswered = answers.every((a) => a !== null);
  const correctCount = answers.filter(
    (a, i) => a === lessonData.questions[i].correct
  ).length;
  const errorList = lessonData.questions
    .map((q, i) => ({
      ...q,
      userAnswer: answers[i],
      isCorrect: answers[i] === q.correct,
    }))
    .filter((q) => !q.isCorrect);

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold mb-2">
            Você acertou {correctCount}/{lessonData.questions.length} questões
            em "{lessonData.title}"
          </div>
          <div className="w-full max-w-lg mb-4">
            <div className="flex items-center gap-4 text-sm mb-2">
              <span className="text-green-600">{correctCount} acertos</span>
              <span className="text-red-600">
                {lessonData.questions.length - correctCount} erros
              </span>
              <span className="ml-auto">
                {answers.filter((a) => a !== null).length}/
                {lessonData.questions.length}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-green-500 rounded"
                style={{
                  width: `${
                    (correctCount / lessonData.questions.length) * 100
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
                    {q.statement}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Sua resposta:{" "}
                    <span className="font-semibold">
                      {q.options[q.userAnswer] || "Não respondida"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Correta:{" "}
                    <span className="font-semibold">
                      {q.options[q.correct]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 font-semibold">
                    26% dos estudantes acertaram
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Remover a seção 'Continue estudando' */}
        </div>
        {/* Barra inferior para navegação */}
        <div
          className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between items-center px-90 py-4 z-40"
          style={{
            boxShadow: "0 -8px 24px -8px rgba(0,0,0,0.10)",
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
            className="px-8 py-2 rounded-md text-center text-blue-600 font-bold text-2xl focus:outline-none transition-colors hover:bg-blue-50"
            onClick={handleNextLesson}
            disabled={lessonData.id >= 91} // Supondo 91 aulas
          >
            Próxima aula
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      {/* Breadcrumb e título */}
      <nav className="text-sm mb-2" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-500">
          <li>Curso</li>
          <li className="mx-2">/</li>
          <li>Módulo 1</li>
          <li className="mx-2">/</li>
          <li className="font-semibold text-gray-900">{lessonData.title}</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-bold mb-2">{lessonData.title}</h1>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-400">
          Aula {lessonData.id} de 91
        </span>
      </div>
      {/* Navegação das questões */}
      <LessonQuestionsNav
        questions={lessonData.questions}
        onSelect={handleSelectQuestion}
        activeIndex={activeTab === "question" ? activeQuestion : null}
        onShowExplanation={handleShowExplanation}
        isExplanationActive={activeTab === "explanation"}
      />
      {/* Conteúdo */}
      <div className="mt-6 min-h-[300px]">
        {activeTab === "explanation" ? (
          <LessonExplanation
            text={lessonData.explanation}
            canFinish={allAnswered}
          />
        ) : (
          <LessonQuestion
            question={lessonData.questions[activeQuestion]}
            questionIndex={activeQuestion}
            totalQuestions={lessonData.questions.length}
            selected={answers[activeQuestion]}
            onBack={handleShowExplanation}
            onSelectQuestion={handleSelectQuestion}
            onAnswer={handleAnswer}
          />
        )}
      </div>
      {/* Navegação fixa no rodapé */}
      <div
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-between items-center px-90 py-4 z-40"
        style={{
          boxShadow: "0 -8px 24px -8px rgba(0,0,0,0.10)",
        }}
      >
        <button
          className="px-8 py-2 rounded-md text-center text-gray-700 font-bold text-2xl focus:outline-none disabled:text-gray-300 transition-colors hover:bg-gray-100"
          onClick={handlePrev}
          disabled={activeTab === "explanation"}
          style={{ border: "none" }}
        >
          Voltar
        </button>
        {activeTab === "question" &&
        activeQuestion === lessonData.questions.length - 1 ? (
          <button
            className="px-8 py-2 rounded-md text-center text-green-600 font-bold text-2xl focus:outline-none disabled:text-green-200 transition-colors hover:bg-green-50"
            onClick={() => allAnswered && setShowResults(true)}
            disabled={!allAnswered}
            style={{ border: "none" }}
          >
            Concluir aula
          </button>
        ) : (
          <button
            className="px-8 py-2 rounded-md text-center text-green-600 font-bold text-2xl focus:outline-none disabled:text-green-200 transition-colors hover:bg-green-50"
            onClick={handleNext}
            disabled={
              activeTab === "question" &&
              activeQuestion === lessonData.questions.length - 1
            }
            style={{ border: "none" }}
          >
            Próxima
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
