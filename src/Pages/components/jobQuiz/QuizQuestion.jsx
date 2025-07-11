// Pages/components/jobQuiz/QuizQuestion.jsx
import React from "react";

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
}) {
  if (!question) return null;

  return (
    <div className="mt-4 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        {question.title}
      </h2>
      <p className="text-gray-600 text-sm">
        {question.description || "Choose the correct answer"}
      </p>

      {(question.type === "mcq" || question.type === "multiple_choice") && (
        <div className="space-y-3 mt-4">
          {question.options?.map((option, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition duration-200 ${
                selectedAnswer === option
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={() => onAnswer(option)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-800 font-medium">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "true_false" && (
        <div className="space-y-3 mt-4">
          {["true", "false"].map((value) => (
            <label
              key={value}
              className={`flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer transition duration-200 ${
                selectedAnswer === value
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={value}
                checked={selectedAnswer === value}
                onChange={() => onAnswer(value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-800 font-medium">{value}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "text" && (
        <div className="mt-4">
          <textarea
            rows={4}
            placeholder="Type your answer here..."
            value={selectedAnswer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      )}
    </div>
  );
}
