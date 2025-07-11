// Pages/components/jobQuiz/QuizCard.jsx
import React from "react";

export default function QuizCard({ quiz, onStart }) {
  if (!quiz) return null;

  return (
    <div className="flex justify-between items-center bg-white shadow-md rounded-xl p-8 w-full max-w-2xl min-h-[160px]">
      <div className="flex flex-col space-y-2">
        <h3 className="text-2xl font-semibold text-gray-900">{quiz.title}</h3>
        <p className="text-gray-600 text-base">{quiz.description}</p>
        <p className="text-gray-500 text-sm">{quiz.questions?.length ?? 0} questions</p>
      </div>
      <button
        onClick={onStart}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md shadow font-medium text-base transition"
      >
        Start Quiz
      </button>
    </div>
  );
}
