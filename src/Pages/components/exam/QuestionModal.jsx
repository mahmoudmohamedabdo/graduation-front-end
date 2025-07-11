import { useState, useEffect } from "react";
import useCountdown from "../../hooks/useCountdown";
import { FiClock } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";

const QuestionModal = ({ question, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [timeLeft, reset] = useCountdown(120);

  useEffect(() => {
    reset();
  }, [question]);

  const handleSubmit = () => {
    const isCorrect = question.type === "code"
      ? userCode.trim() === question.correctAnswer.trim()
      : selected === question.correctAnswer;
    setFeedback({
      correct: isCorrect,
      userAnswer: question.type === "code" ? userCode : selected,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
    setShowFeedback(true);
    onSubmit(isCorrect);
  };

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 pointer-events-auto">
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-t-2xl px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Practice Question</h3>
            <p className="text-sm text-gray-500 mt-0.5">{question.topic}</p>
          </div>
          <div className="flex items-center gap-1 bg-white shadow px-3 py-1 rounded-md">
            <FiClock className="text-blue-600 text-sm" />
            <span className="text-xs font-mono text-gray-700">{timeLeft}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Easy</span>
              <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">Fundamentals</span>
            </div>
            <h4 className="font-bold text-md text-gray-900 mb-1">{question.title}</h4>
            <p className="text-sm text-gray-500">{question.description}</p>
          </div>

          {!showFeedback && (
            <>
              {question.type === "code" ? (
                <div className="mb-6">
                  <label htmlFor="codeAnswer" className="block mb-2 text-sm font-semibold text-gray-700">
                    Your Code
                  </label>
                  <textarea
                    id="codeAnswer"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={10}
                    placeholder={`function MyComponent() {\n  return <h1>Hello</h1>;\n}`} 
                    className="w-full border border-gray-300 rounded-md p-3 font-mono text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
                  />
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {question.options?.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium transition duration-150 ease-in-out w-full
                        ${selected === opt ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-blue-300"}`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={opt}
                        onChange={() => setSelected(opt)}
                        className="mr-3"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              <button
                onClick={handleSubmit}
                className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.125 17.25L3.75 12m0 0l6.375-5.25M3.75 12h16.5"
                  />
                </svg>
                Submit Answer
              </button>
            </>
          )}

          {showFeedback && (
            <div
              className={`rounded-xl px-6 py-8 text-center space-y-5 ${
                feedback.correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex justify-center">
                <div
                  className={`p-3 rounded-full shadow-md ${
                    feedback.correct ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {feedback.correct ? (
                    <IoMdCheckmarkCircleOutline className="text-green-600 text-4xl" />
                  ) : (
                    <MdClose className="text-red-600 text-4xl" />
                  )}
                </div>
              </div>
              <h3 className={`font-bold text-xl ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
                {feedback.correct ? "Excellent!" : "Not Quite Right"}
              </h3>
              <p className={`text-sm ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
                {feedback.correct ? "You got it right! Great job." : "Learning opportunity ahead!"}
              </p>

              {!feedback.correct && (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-left">
                  <p className="font-semibold text-red-700 mb-1">Your Answer</p>
                  <p className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{feedback.userAnswer}</p>
                </div>
              )}

              <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-left">
                <p className="font-semibold text-green-700 mb-1">Correct Answer</p>
                <p className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{feedback.correctAnswer}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <p className="text-sm font-semibold text-blue-700 mb-1">Why is this correct?</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{feedback.explanation}</p>
              </div>

              <button
                onClick={onClose}
                className="mx-auto block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg shadow-md"
              >
                Continue Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
