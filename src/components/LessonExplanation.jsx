import React from "react";

const LessonExplanation = ({ text }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 text-gray-800 text-base whitespace-pre-line">
        {text}
      </div>
    </div>
  );
};

export default LessonExplanation;
