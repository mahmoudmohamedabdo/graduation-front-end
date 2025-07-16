import { useState, useEffect } from "react";
import useCountdown from "../../hooks/useCountdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import axios from "axios";
import AnswerFeedback from "./AnswerFeedback";

const QuestionModal = ({ question, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, reset] = useCountdown(120);

  useEffect(() => {
    const fetchCorrectAnswer = async () => {
      try {
        const response = await axios.get(`/api/TrackQuestionOptions/correct/by-question/${question.id}`);
        if (response.data.success && response.data.data.length > 0) {
          setCorrectAnswer(response.data.data[0].optionText);
        } else {
          setError("Failed to fetch correct answer");
        }
      } catch (err) {
        setError("Error fetching correct answer: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrectAnswer();
    reset();
  }, [question, reset]);

  const handleSubmit = () => {
    const isCorrect = selected === correctAnswer;
    setFeedback({
      correct: isCorrect,
      userAnswer: selected,
      correctAnswer: correctAnswer,
      explanation: question.explanation || "No explanation provided",
    });
    setShowFeedback(true);
    onSubmit(question.id, isCorrect);
  };

  if (!question) return null;
  if (loading) return <p className="text-center text-gray-500">Loading question data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 pointer-events-auto">
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-t-2xl px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Practice Question</h3>
          <div className="flex items-center gap-1 bg-white shadow px-3 py-1 rounded-md">
            <IoMdCheckmarkCircleOutline className="text-blue-600 text-sm" />
            <span className="text-xs font-mono text-gray-700">{timeLeft}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-bold text-md text-gray-900 mb-1">{question.questionText}</h4>
            <p className="text-sm text-gray-500">{question.explanation || "No description available"}</p>
          </div>
          {!showFeedback && (
            <div className="space-y-3 mb-6">
              {question.options && question.options.length > 0 ? (
                question.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={opt.optionText}
                      onChange={() => setSelected(opt.optionText)}
                      className="mr-3"
                    />
                    {opt.optionText}
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No options available for this question</p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-white ${
                  selected ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
            </div>
          )}
          {showFeedback && <AnswerFeedback feedback={feedback} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;