import { useState } from "react";
import { MdClose } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";
import axios from "axios";
import AnswerFeedback from "./AnswerFeedback";
import { useParams } from "react-router-dom";

const AllQuestions = ({ questions, completed, onTake, onSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({}); // تخزين الإجابات المختارة لكل سؤال
  const [feedbacks, setFeedbacks] = useState({}); // تخزين الفيدباك لكل سؤال
  const [loading, setLoading] = useState({}); // حالة التحميل لكل سؤال
  const [errors, setErrors] = useState({}); // حالة الخطأ لكل سؤال
  const { id: trackId } = useParams();
  // const attemptId = localStorage.getItem(`attemptId_${trackId}`);

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
    if (!selectedAnswers[questionId]) {
      console.warn(`No answer selected for question ${questionId}`);
      setErrors((prev) => ({ ...prev, [questionId]: "Please select an answer" }));
      return;
    }

    const attemptId = parseInt(localStorage.getItem(`attemptId_${trackId}`));
    if (!attemptId) {
      setErrors((prev) => ({ ...prev, [questionId]: "Attempt ID is missing" }));
      console.error("Attempt ID not found in localStorage");
      return;
    }

    setLoading((prev) => ({ ...prev, [questionId]: true }));

    try {
      // Fetch correct answer
      const response = await axios.get(`/api/TrackQuestionOptions/correct/by-question/${questionId}`);
      if (!response.data.success || !response.data.data || response.data.data.length === 0) {
        throw new Error("Failed to fetch correct answer or no data returned");
      }

      const correctAnswer = response.data.data[0].optionText;
      const correctAnswerId = response.data.data[0].id;
      const isCorrect = selectedAnswers[questionId] === correctAnswer;
      const question = questions.find((q) => q.id === questionId);

      // Constructing submissionData (primary format)
      const submissionData = {
        attemptId,
        questionId,
        selectedOptions: [correctAnswerId],
      };

      console.log("Submitting data (primary format):", submissionData);

      try {
        // Submit answer
        const submitResponse = await axios.post(
          "http://fit4job.runasp.net/api/TrackQuestionAnswers/submit",
          submissionData
        );

        console.log("Submit response:", {
          status: submitResponse.status,
          data: submitResponse.data,
        });

        if (submitResponse.data?.success) {
          setFeedbacks((prev) => ({
            ...prev,
            [questionId]: {
              correct: isCorrect,
              userAnswer: selectedAnswers[questionId],
              correctAnswer,
              explanation: question.explanation || "No explanation provided",
            },
          }));
          onSubmit(questionId, isCorrect);
          console.log("Submission successful:", submissionData);
        } else {
          throw new Error(`Submission failed: ${submitResponse.data?.message || "Unknown error"}`);
        }
      } catch (submitError) {
        // Fallback: Try alternative submissionData format
        console.warn("Primary submission failed, trying alternative format:", submitError.message);
        const alternativeSubmissionData = {
          AttemptId: attemptId,
          QuestionId: questionId,
          SelectedOptionId: correctAnswerId, // Single ID instead of array
        };

        console.log("Submitting data (alternative format):", alternativeSubmissionData);

        const alternativeResponse = await axios.post(
          "http://fit4job.runasp.net/api/TrackQuestionAnswers/submit",
          alternativeSubmissionData
        );

        console.log("Alternative submit response:", {
          status: alternativeResponse.status,
          data: alternativeResponse.data,
        });

        if (alternativeResponse.data?.success) {
          setFeedbacks((prev) => ({
            ...prev,
            [questionId]: {
              correct: isCorrect,
              userAnswer: selectedAnswers[questionId],
              correctAnswer,
              explanation: question.explanation || "No explanation provided",
            },
          }));
          onSubmit(questionId, isCorrect);
          console.log("Submission successful (alternative format):", alternativeSubmissionData);
        } else {
          throw new Error(`Alternative submission failed: ${alternativeResponse.data?.message || "Unknown error"}`);
        }
      }
    } catch (err) {
      console.error("Error in handleAnswerSubmit:", {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
        } : null,
      });
      const detailedError = err.response?.data?.message || err.message;
      setErrors((prev) => ({
        ...prev,
        [questionId]: `Error: ${detailedError}`,
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
                        className={`mt-2 w-full py-2 rounded-xl text-white ${selectedAnswers[question.id] && !loading[question.id]
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

