import React from "react";

const LessonQuestion = ({ question, questionIndex, selected, onAnswer }) => {
  const handleSelect = (idx) => {
    if (onAnswer) onAnswer(questionIndex, idx);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4 text-gray-800 font-medium">{question.statement}</div>
      <div className="flex flex-col gap-2 mb-6">
        {question.options.map((opt, idx) => (
          <button
            key={opt}
            className={`w-full text-left px-4 py-2 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              selected === idx
                ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400"
                : "bg-gray-50 hover:bg-blue-50 text-gray-800 border-gray-200"
            }`}
            tabIndex={0}
            aria-label={`Alternativa ${opt}`}
            onClick={() => handleSelect(idx)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && selected !== idx)
                handleSelect(idx);
            }}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="mb-4">
          {selected === question.correct ? (
            <div className="flex items-center gap-2 text-green-600 font-semibold mb-2">
              <span>✔ Você acertou!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
              <span>✖ Você errou!</span>
            </div>
          )}
          <div className="bg-white border border-green-300 rounded-lg p-4 mt-2 text-gray-800">
            <div className="font-bold mb-1">Explicação</div>
            <div>{question.explanation}</div>
          </div>
        </div>
      )}
      {/* Removido: botões de navegação internos */}
    </div>
  );
};

export default LessonQuestion;
