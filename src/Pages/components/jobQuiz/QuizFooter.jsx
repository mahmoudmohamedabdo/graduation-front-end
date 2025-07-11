// Pages/components/jobQuiz/QuizFooter.jsx
import React from "react";

export default function QuizFooter({ onNext, onBack, isFirst, isLast }) {
  return (
    <div className="flex justify-between mt-6">
      <button
        onClick={onBack}
        disabled={isFirst}
        className={`px-4 py-2 rounded-md text-sm font-medium shadow ${isFirst ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
      >
        Previous
      </button>
      <button
        onClick={onNext}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow text-sm font-medium"
      >
        {isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}