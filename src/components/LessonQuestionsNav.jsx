import React from "react";

const PaperIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block w-4 h-4 mr-1 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
    <line x1="8" y1="8" x2="16" y2="8" strokeWidth="2" />
    <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" />
    <line x1="8" y1="16" x2="12" y2="16" strokeWidth="2" />
  </svg>
);

const LessonQuestionsNav = ({
  questions,
  activeIndex,
  onSelect,
  onShowExplanation,
  isExplanationActive,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`px-3 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
          isExplanationActive
            ? "bg-green-500 text-white"
            : "bg-green-50 hover:bg-green-100 text-green-800"
        }`}
        tabIndex={0}
        aria-label="Ver explicação"
        onClick={onShowExplanation}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onShowExplanation();
        }}
      >
        Explicação
      </button>
      {questions.map((q, idx) => (
        <button
          key={q.id}
          className={`flex items-center px-3 py-1 rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors ${
            activeIndex === idx
              ? "bg-green-500 text-white"
              : "bg-green-50 hover:bg-green-100 text-green-800"
          }`}
          tabIndex={0}
          aria-label={`Questão ${idx + 1}`}
          onClick={() => onSelect(idx)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(idx);
          }}
        >
          <PaperIcon />
          {idx + 1}
        </button>
      ))}
    </div>
  );
};

export default LessonQuestionsNav;
