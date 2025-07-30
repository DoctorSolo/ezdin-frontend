import React from "react";
import ScoreDisplay from "./ScoreDisplay";

const ScoreNotification = ({ pointsEarned, show = true }) => {
  if (!show || pointsEarned <= 0) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mb-4 animate-pulse">
      <div className="flex items-center gap-2 text-yellow-800">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="font-bold">+{pointsEarned} pontos ganhos!</span>
      </div>
      <p className="text-sm text-yellow-700 mt-1">
        Parabéns! Você ganhou 100 pontos por cada questão acertada.
      </p>
    </div>
  );
};

export default ScoreNotification;
