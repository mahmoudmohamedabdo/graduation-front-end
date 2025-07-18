import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import axios from "axios";
import AnswerFeedback from "./AnswerFeedback";
import { useParams } from "react-router-dom";

const AllQuestions = ({ questions, completed, onSubmit, localCompleted, setLocalCompleted }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const { id: trackId } = useParams();

  // تحديث localStorage عند حل سؤال جديد (نفس الدالة لكن بدون تعريف الحالة محلياً)
  const addCompletedQuestion = (questionId) => {
    setLocalCompleted((prev) => {
      if (!prev.includes(questionId)) {
        const updated = [...prev, questionId];
        localStorage.setItem(`completedQuestions_${trackId}`, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const getStatus = (questionId) => {
    if (localCompleted.includes(questionId)) return "completed";
    const q = completed.find((c) => c.id === questionId);
    return q ? q.status : null;
  };

  const getStatusIcon = (status) => {
    if (status === "correct") return <IoMdCheckmarkCircle className="text-blue-600 text-base" />;
    if (status === "wrong") return <MdClose className="text-red-600 text-base" />;
    return <LuRefreshCcw className="text-gray-400 text-base" />;
  };

  const handleAnswerSubmit = async (questionId) => {
    // التحقق من أن السؤال لم يتم الإجابة عليه بالفعل
    if (feedbacks[questionId] || getStatus(questionId)) {
      console.warn("Question already answered.");
      return;
    }

    if (!selectedAnswers[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: "Please select an answer" }));
      return;
    }

    const attemptId = parseInt(localStorage.getItem(`attemptId_${trackId}`));
    if (!attemptId) {
      setErrors((prev) => ({ ...prev, [questionId]: "Attempt ID is missing" }));
      return;
    }

    setLoading((prev) => ({ ...prev, [questionId]: true }));
    setErrors((prev) => ({ ...prev, [questionId]: null }));

    try {
      // الحصول على الإجابة الصحيحة
      const response = await axios.get(`/api/TrackQuestionOptions/correct/by-question/${questionId}`);
      if (!response.data.success || !response.data.data || response.data.data.length === 0) {
        throw new Error("Failed to fetch correct answer or no data returned");
      }

      const correctAnswer = response.data.data[0].optionText;
      const correctAnswerId = response.data.data[0].id;
      const question = questions.find((q) => q.id === questionId);

      const selectedOption = question.options.find(
        (opt) => opt.optionText === selectedAnswers[questionId]
      );

      if (!selectedOption) {
        throw new Error("Selected option not found in question options");
      }

      const isCorrect = selectedOption.optionText === correctAnswer;

      // إعداد بيانات الإرسال
      const submissionData = {
        attemptId,
        questionId,
        selectedOptions: [selectedOption.id],
      };

      // إرسال الإجابة بدون هيدر Content-Type
      const submitResponse = await axios.post(
        "http://fit4job.runasp.net/api/TrackQuestionAnswers/submit",
        submissionData
      );

      if (submitResponse.data?.success) {
        setFeedbacks((prev) => ({
          ...prev,
          [questionId]: {
            correct: isCorrect,
            userAnswer: selectedOption.optionText,
            correctAnswer,
            explanation: question.explanation || "No explanation provided",
          },
        }));
        onSubmit(questionId, isCorrect);
        // أضف السؤال إلى قائمة الأسئلة المحلولة في localStorage
        addCompletedQuestion(questionId);
      } else {
        throw new Error(`Submission failed: ${submitResponse.data?.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      const detailedError = err.response?.data?.message || err.message;
      setErrors((prev) => ({
        ...prev,
        [questionId]: `Error: ${detailedError.includes("duplicate key") 
          ? "You have already answered this question" 
          : detailedError}`,
      }));
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
          const isQuestionCompleted = status || isFeedbackShown;

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

                  {!isQuestionCompleted && question.options && question.options.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-gray-700">Select an answer:</p>
                      {question.options.map((option, idx) => (
                        <label
                          key={idx}
                          className={`flex items-center border rounded-lg px-4 py-2 cursor-pointer text-sm font-medium ${
                            isQuestionCompleted ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
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
                            disabled={loading[question.id] || isQuestionCompleted}
                            checked={selectedAnswers[question.id] === option.optionText}
                          />
                          {option.optionText}
                        </label>
                      ))}
                      <button
                        onClick={() => handleAnswerSubmit(question.id)}
                        disabled={!selectedAnswers[question.id] || loading[question.id] || isQuestionCompleted}
                        className={`mt-2 w-full py-2 rounded-xl text-white ${
                          selectedAnswers[question.id] && !loading[question.id] && !isQuestionCompleted
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {loading[question.id] ? "Submitting..." : "Submit Answer"}
                      </button>
                    </div>
                  ) : (
                    !isQuestionCompleted && <p className="text-sm text-gray-500">No options available</p>
                  )}

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

                  {errors[question.id] && (
                    <p className="text-sm text-red-500 mt-2">{errors[question.id]}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-400">
                    {status ? "Completed" : "Not Attempted"}
                    {getStatusIcon(status)}
                  </div>
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