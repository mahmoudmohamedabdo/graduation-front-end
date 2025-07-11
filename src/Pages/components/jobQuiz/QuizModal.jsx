// Pages/components/jobQuiz/QuizModal.jsx
import React, { useState } from "react";
import QuizQuestion from "./QuizQuestion";
import QuestionProgress from "./QuestionProgress";
import QuizFooter from "./QuizFooter";
import ThankYouModal from "./ThankYouModal";
import useCountdown from "../../hooks/useCountdown";

export default function QuizModal({ quiz, onClose }) {
  const questions = quiz.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showThankYou, setShowThankYou] = useState(false);
  const [timeLeft, resetTimer] = useCountdown(60);

  const handleAnswer = (index, answer) => {
    const updated = [...answers];
    updated[index] = answer;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowThankYou(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (showThankYou) return <ThankYouModal onClose={onClose} />;

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {quiz.title}
        </h2>

        <QuestionProgress
          current={currentIndex + 1}
          total={questions.length}
          timeLeft={timeLeft}
        />

        <QuizQuestion
          question={questions[currentIndex]}
          selectedAnswer={answers[currentIndex]}
          onAnswer={(answer) => handleAnswer(currentIndex, answer)}
        />

        <QuizFooter
          isFirst={currentIndex === 0}
          isLast={currentIndex === questions.length - 1}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
