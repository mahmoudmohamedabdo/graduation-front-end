import { useState } from "react";
import { MdClose } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import axios from "axios";
import AnswerFeedback from "./AnswerFeedback";

const AllQuestions = ({ questions, completed, onTake, onSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // تخزين الإجابات المختارة لكل سؤال
  const [feedbacks, setFeedbacks] = useState({}); // تخزين الفيدباك لكل سؤال
  const [loading, setLoading] = useState({}); // حالة التحميل لكل سؤال
  const [errors, setErrors] = useState({}); // حالة الخطأ لكل سؤال

  const getStatus = (questionId) => {
    const q = completed.find((c) => c.id === questionId);
    return q ? q.status : null;
  };

  const getStatusIcon = (status) => {
    if (status === "correct") return <IoMdCheckmarkCircle className="text-blue-600 text-base" />;
    if (status === "wrong") return <MdClose className="text-red-600 text-base" />;
    return <LuRefreshCcw className="text-gray-400 text-base" />;
  };

  const handleAnswerSubmit = async (questionId) => {
    if (!selectedAnswers[questionId]) return; // لا يتم الإرسال إذا لم يتم اختيار إجابة

    setLoading((prev) => ({ ...prev, [questionId]: true }));

    try {
      const response = await axios.get(`/api/TrackQuestionOptions/correct/by-question/${questionId}`);
      if (response.data.success && response.data.data.length > 0) {
        const correctAnswer = response.data.data[0].optionText;
        const isCorrect = selectedAnswers[questionId] === correctAnswer;
        const question = questions.find((q) => q.id === questionId);

        setFeedbacks((prev) => ({
          ...prev,
          [questionId]: {
            correct: isCorrect,
            userAnswer: selectedAnswers[questionId],
            correctAnswer: correctAnswer,
            explanation: question.explanation || "No explanation provided",
          },
        }));

        onSubmit(questionId, isCorrect);
      } else {
        setErrors((prev) => ({ ...prev, [questionId]: "Failed to fetch correct answer" }));
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, [questionId]: "Error fetching correct answer: " + err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  return (
    <div className="space-y-5 mt-6">
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((question) => {
          const status = getStatus(question.id);
          const isFeedbackShown = !!feedbacks[question.id];

          return (
            <div key={question.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {question.difficultyLevel}
                    </span>
                  </div>
                  <h4 className="font-bold text-md text-gray-900 mb-1">{question.questionText}</h4>
                  <p className="text-sm text-gray-500 mb-3">{question.explanation || "No explanation provided"}</p>

                  {/* عرض الخيارات كـ radio buttons */}
                  {!isFeedbackShown && question.options && question.options.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">Select an answer:</p>
                      {question.options.map((option, idx) => (
                        <label
                          key={idx}
                          className="flex items-center border rounded-lg px-4 py-2 cursor-pointer text-sm font-medium"
                        >
                          <input
                            type="radio"
                            name={`answer-${question.id}`}
                            value={option.optionText}
                            onChange={() =>
                              setSelectedAnswers((prev) => ({
                                ...prev,
                                [question.id]: option.optionText,
                              }))
                            }
                            className="mr-3"
                            disabled={loading[question.id]}
                          />
                          {option.optionText}
                        </label>
                      ))}
                      <button
                        onClick={() => handleAnswerSubmit(question.id)}
                        disabled={!selectedAnswers[question.id] || loading[question.id]}
                        className={`mt-2 w-full py-2 rounded-xl text-white ${
                          selectedAnswers[question.id] && !loading[question.id]
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {loading[question.id] ? "Submitting..." : "Submit Answer"}
                      </button>
                    </div>
                  ) : (
                    !isFeedbackShown && <p className="text-sm text-gray-500">No options available</p>
                  )}

                  {/* عرض الفيدباك إذا تم الإرسال */}
                  {isFeedbackShown && (
                    <AnswerFeedback
                      feedback={feedbacks[question.id]}
                      onClose={() => {
                        setFeedbacks((prev) => {
                          const newFeedbacks = { ...prev };
                          delete newFeedbacks[question.id];
                          return newFeedbacks;
                        });
                        setSelectedAnswers((prev) => {
                          const newAnswers = { ...prev };
                          delete newAnswers[question.id];
                          return newAnswers;
                        });
                      }}
                    />
                  )}

                  {/* عرض رسالة الخطأ إذا وجدت */}
                  {errors[question.id] && (
                    <p className="text-sm text-red-500 mt-2">{errors[question.id]}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                    {status ? status : "Not Attempted"}
                    {getStatusIcon(status)}
                  </div>
                  <button
                    onClick={() => onTake(question)}
                    className="btn btn-sm rounded-full p-5 bg-[#1C79EA] hover:bg-[#2546EB] text-white"
                  >
                    Take Question
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No questions available.</p>
      )}
    </div>
  );
};

export default AllQuestions;