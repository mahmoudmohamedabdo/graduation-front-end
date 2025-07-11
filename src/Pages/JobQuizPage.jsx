// Pages/JobQuizPage.jsx
import React, { useState } from "react";
import QuizCard from "./components/jobQuiz/QuizCard";
import QuizModal from "./components/jobQuiz/QuizModal";
import JopNav from "../layouts/JopNav";

export default function JobQuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const quizzes = [
    {
      id: 1,
      title: "Frontend Fundamentals",
      description: "You must take this quiz",
      questions: [
        {
          id: 1,
          title: "What is JSX?",
          description: "Choose the correct answer",
          type: "mcq",
          options: ["A syntax extension", "A CSS library", "A router"],
        },
        {
          id: 2,
          title: "What is useState used for?",
          description: "Explain shortly",
          type: "text",
        },
        {
          id: 3,
          title: "What's React component?",
          description: "Choose one",
          type: "mcq",
          options: ["Function", "File", "Database"],
        },
      ],
    },
  ];

  const handleStart = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gray-50 shadow-md">
        <div className="bg-white p-4 sm:p-6 shadow-sm rounded-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Frontend Development</h2>
        </div>
        <JopNav />
      </div>

      {/* Main Content - Styled like JopDetails */}
      <div className="bg-white p-6 rounded shadow-sm m-5">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quiz Section</h2>

        <div className="text-sm text-gray-600 mb-6">
          Test your knowledge with our available quizzes.
        </div>

        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="w-full md:w-[48%]">
              <QuizCard quiz={quiz} onStart={() => handleStart(quiz)} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedQuiz && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-40 flex justify-center items-center px-4">
          <QuizModal quiz={selectedQuiz} onClose={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
